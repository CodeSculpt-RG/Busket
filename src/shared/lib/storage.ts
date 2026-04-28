import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const STORAGE_FILE = `${FileSystem.documentDirectory ?? ''}busket-session.json`;

const getWebStorage = () => {
  const globalScope = globalThis as typeof globalThis & {
    localStorage?: {
      getItem: (key: string) => string | null;
      setItem: (key: string, value: string) => void;
      removeItem: (key: string) => void;
    };
  };

  return Platform.OS === 'web' ? globalScope.localStorage : undefined;
};

export const readStorageItem = async (key: string): Promise<string | null> => {
  try {
    const webStorage = getWebStorage();

    if (webStorage) {
      return webStorage.getItem(key);
    }

    if (!FileSystem.documentDirectory) {
      return null;
    }

    const fileInfo = await FileSystem.getInfoAsync(STORAGE_FILE);

    if (!fileInfo.exists) {
      return null;
    }

    const content = await FileSystem.readAsStringAsync(STORAGE_FILE);
    const parsed = JSON.parse(content) as Record<string, string | undefined>;

    return parsed[key] ?? null;
  } catch {
    return null;
  }
};

export const writeStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    const webStorage = getWebStorage();

    if (webStorage) {
      webStorage.setItem(key, value);
      return;
    }

    if (!FileSystem.documentDirectory) {
      return;
    }

    const fileInfo = await FileSystem.getInfoAsync(STORAGE_FILE);
    const current = fileInfo.exists ? JSON.parse(await FileSystem.readAsStringAsync(STORAGE_FILE)) : {};
    const next = {
      ...current,
      [key]: value,
    };

    await FileSystem.writeAsStringAsync(STORAGE_FILE, JSON.stringify(next));
  } catch {
    // Storage writes are best-effort; callers keep in-memory state stable.
  }
};

export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    const webStorage = getWebStorage();

    if (webStorage) {
      webStorage.removeItem(key);
      return;
    }

    if (!FileSystem.documentDirectory) {
      return;
    }

    const fileInfo = await FileSystem.getInfoAsync(STORAGE_FILE);

    if (!fileInfo.exists) {
      return;
    }

    const current = JSON.parse(await FileSystem.readAsStringAsync(STORAGE_FILE)) as Record<string, string | undefined>;
    delete current[key];

    await FileSystem.writeAsStringAsync(STORAGE_FILE, JSON.stringify(current));
  } catch {
    // Safe no-op.
  }
};
