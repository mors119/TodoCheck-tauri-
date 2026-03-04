import {
  CompletionsSchema,
  TaskDailyMemosSchema,
  TasksSchema,
  TimeEntriesSchema,
} from '../domain/schemas';
import type { Completion, Task, TaskDailyMemo, TimeEntry } from '../domain/types';

const STORAGE_KEYS = {
  tasks: 'dailycheck.tasks.v2',
  completions: 'dailycheck.completions.v1',
  timeEntries: 'dailycheck.timeEntries.v1',
  taskDailyMemos: 'dailycheck.taskDailyMemos.v1',
} as const;

function safeRead<T>(key: string, parse: (value: unknown) => T, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const decoded: unknown = JSON.parse(raw);
    return parse(decoded);
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage write failure
  }
}

export function loadTasks(): Task[] {
  return safeRead(
    STORAGE_KEYS.tasks,
    (decoded) => {
      const result = TasksSchema.safeParse(decoded);
      return result.success ? (result.data as Task[]) : [];
    },
    [],
  );
}

export function saveTasks(tasks: Task[]): void {
  safeWrite(STORAGE_KEYS.tasks, tasks);
}

export function loadCompletions(): Completion[] {
  return safeRead(
    STORAGE_KEYS.completions,
    (decoded) => {
      const result = CompletionsSchema.safeParse(decoded);
      return result.success ? (result.data as Completion[]) : [];
    },
    [],
  );
}

export function saveCompletions(items: Completion[]): void {
  safeWrite(STORAGE_KEYS.completions, items);
}

export function loadTimeEntries(): TimeEntry[] {
  return safeRead(
    STORAGE_KEYS.timeEntries,
    (decoded) => {
      const result = TimeEntriesSchema.safeParse(decoded);
      return result.success ? (result.data as TimeEntry[]) : [];
    },
    [],
  );
}

export function saveTimeEntries(items: TimeEntry[]): void {
  safeWrite(STORAGE_KEYS.timeEntries, items);
}

export function loadTaskDailyMemos(): TaskDailyMemo[] {
  return safeRead(
    STORAGE_KEYS.taskDailyMemos,
    (decoded) => {
      const result = TaskDailyMemosSchema.safeParse(decoded);
      return result.success ? (result.data as TaskDailyMemo[]) : [];
    },
    [],
  );
}

export function saveTaskDailyMemos(memos: TaskDailyMemo[]): void {
  safeWrite(STORAGE_KEYS.taskDailyMemos, memos);
}
