import type { Store } from '@tauri-apps/plugin-store';
import { isTauri } from './runtime';

const SETTINGS_FILE = 'settings.json';

let appStorePromise: Promise<Store> | null = null;

function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function storageSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage write failure
  }
}

export async function getAppStore(): Promise<Store> {
  if (!isTauri()) {
    throw new Error('Tauri Store is unavailable in web runtime.');
  }

  if (!appStorePromise) {
    appStorePromise = import('@tauri-apps/plugin-store').then(({ load }) =>
      load(SETTINGS_FILE, { autoSave: 150, defaults: {} }),
    );
  }

  return appStorePromise;
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  if (!isTauri()) {
    return storageGet(key, fallback);
  }

  try {
    const store = await getAppStore();
    const value = await store.get<T>(key);
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  if (!isTauri()) {
    storageSet(key, value);
    return;
  }

  const store = await getAppStore();
  await store.set(key, value);
}
