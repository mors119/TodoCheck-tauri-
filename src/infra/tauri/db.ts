import { isTauri } from './runtime';

export type AppDb = {
  init(): Promise<void>;
  execute(sql: string, bind?: unknown[]): Promise<void>;
  select<T>(sql: string, bind?: unknown[]): Promise<T[]>;
};

const DB_URL = 'sqlite:app.db';

let dbPromise: Promise<import('@tauri-apps/plugin-sql').default> | null = null;

async function getDatabase(): Promise<import('@tauri-apps/plugin-sql').default> {
  if (!isTauri()) {
    throw new Error('SQLite is unavailable in web runtime.');
  }

  if (!dbPromise) {
    dbPromise = import('@tauri-apps/plugin-sql').then(({ default: Database }) =>
      Database.load(DB_URL),
    );
  }

  return dbPromise;
}

async function init(): Promise<void> {
  if (!isTauri()) return;

  const db = await getDatabase();
  await db.execute(
    'CREATE TABLE IF NOT EXISTS settings_kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)',
    [],
  );
}

async function execute(sql: string, bind: unknown[] = []): Promise<void> {
  if (!isTauri()) return;
  const db = await getDatabase();
  await db.execute(sql, bind);
}

async function select<T>(sql: string, bind: unknown[] = []): Promise<T[]> {
  if (!isTauri()) {
    return [];
  }
  const db = await getDatabase();
  return db.select<T[]>(sql, bind);
}

export const appDb: AppDb = {
  init,
  execute,
  select,
};
