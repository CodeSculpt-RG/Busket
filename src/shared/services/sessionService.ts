import type { AuthSnapshot } from '../../app/store/auth.store';
import type { BrandProfile } from '../../app/store/brand.store';
import type { CreatorOnboardingState, CreatorProfile, CreatorVideoMetadata } from '../../app/store/creator.store';
import { readStorageItem, removeStorageItem, writeStorageItem } from '../lib/storage';
import { apiClient, type ApiError } from './apiClient';

const SESSION_KEY = 'busket.session.v2.social';

export type PersistedSession = {
  auth: AuthSnapshot;
  brandOnboardingCompleted?: boolean;
  brandProfile?: BrandProfile | null;
  creatorOnboarding?: CreatorOnboardingState;
  creatorProfile: CreatorProfile | null;
  creatorVideos: CreatorVideoMetadata[];
  updatedAt: string;
};

export type SessionRestoreResult =
  | { status: 'authenticated'; session: PersistedSession }
  | { status: 'guest' }
  | { status: 'error'; error: string };

const isRole = (value: unknown): value is AuthSnapshot['role'] => value === 'creator' || value === 'brand' || value === null;

const isSocialUser = (value: unknown): value is NonNullable<AuthSnapshot['user']> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<NonNullable<AuthSnapshot['user']>>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    (candidate.provider === 'google' || candidate.provider === 'apple') &&
    (candidate.role === 'creator' || candidate.role === 'brand')
  );
};

const isValidSessionShape = (value: unknown): value is PersistedSession => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<PersistedSession>;
  return Boolean(candidate.auth && typeof candidate.auth.isAuthenticated === 'boolean' && isRole(candidate.auth.role));
};

export const sessionService = {
  async restore(): Promise<SessionRestoreResult> {
    try {
      const raw = await readStorageItem(SESSION_KEY);

      if (!raw) {
        return { status: 'guest' };
      }

      const parsed = JSON.parse(raw) as unknown;

      if (!isValidSessionShape(parsed) || !parsed.auth.isAuthenticated || !parsed.auth.role || !isSocialUser(parsed.auth.user)) {
        await this.clear();
        return { status: 'guest' };
      }

      if (parsed.auth.role === 'brand' && !parsed.brandOnboardingCompleted && !parsed.brandProfile) {
        await this.clear();
        return { status: 'guest' };
      }

      const validation = await this.validate(parsed);

      if (!validation.ok) {
        if (validation.clearSession) {
          await this.clear();
          return { status: 'guest' };
        }

        return { status: 'error', error: validation.error?.message ?? 'Could not restore your session.' };
      }

      return { status: 'authenticated', session: parsed };
    } catch {
      await this.clear();
      return { status: 'guest' };
    }
  },

  async persist(session: Omit<PersistedSession, 'updatedAt'>): Promise<void> {
    await writeStorageItem(
      SESSION_KEY,
      JSON.stringify({
        ...session,
        updatedAt: new Date().toISOString(),
      }),
    );
  },

  async clear(): Promise<void> {
    await removeStorageItem(SESSION_KEY);
  },

  async validate(session: PersistedSession): Promise<{ ok: boolean; clearSession?: boolean; error?: ApiError }> {
    if (!session.auth.accessToken) {
      return { ok: true };
    }

    if (session.auth.expiresAt && Date.parse(session.auth.expiresAt) <= Date.now()) {
      return { ok: false, clearSession: true };
    }

    const result = await apiClient.get<{ valid: boolean }>('/auth/session', { token: session.auth.accessToken });

    if (result.ok) {
      return { ok: true };
    }

    return {
      ok: false,
      clearSession: result.error?.code === 'unauthorized',
      error: result.error ?? undefined,
    };
  },
};
