export type ApiErrorCode = 'network' | 'timeout' | 'unauthorized' | 'malformed' | 'server' | 'unknown';

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  status?: number;
};

export type ApiResult<T> = {
  data: T | null;
  error: ApiError | null;
  ok: boolean;
};

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  timeoutMs?: number;
  token?: string | null;
};

const DEFAULT_TIMEOUT_MS = 12000;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
let unauthorizedHandler: (() => void) | null = null;

const safeError = (code: ApiErrorCode, message: string, status?: number): ApiError => ({
  code,
  message,
  status,
});

const parseResponse = async <T>(response: Response): Promise<ApiResult<T>> => {
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : 'Request failed. Please try again.';

    return {
      data: null,
      error: safeError(response.status === 401 ? 'unauthorized' : 'server', message, response.status),
      ok: false,
    };
  }

  return {
    data: payload as T,
    error: null,
    ok: true,
  };
};

export const apiClient = {
  async request<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
    if (!API_BASE_URL && path.startsWith('/')) {
      return {
        data: null,
        error: safeError('network', 'API is not configured yet.'),
        ok: false,
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

    try {
      const response = await fetch(url, {
        ...options,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        headers: {
          Accept: 'application/json',
          ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
          ...options.headers,
        },
        signal: controller.signal,
      });

      const result = await parseResponse<T>(response);

      if (result.error?.code === 'unauthorized' && unauthorizedHandler) {
        unauthorizedHandler();
      }

      return result;
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          data: null,
          error: safeError('malformed', 'Server returned an invalid response.'),
          ok: false,
        };
      }

      return {
        data: null,
        error: safeError(error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'network', 'Network request failed.'),
        ok: false,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  },

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'POST', body });
  },

  onUnauthorized(handler: () => void) {
    unauthorizedHandler = handler;
  },
};
