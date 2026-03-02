import {
  CompletionsSchema,
  TasksSchema,
  TimeEntriesSchema,
} from '../domain/schemas';
import type { Completion, Task, TimeEntry } from '../domain/types';

const STORAGE_KEYS = {
  tasks: 'dailycheck.tasks.v2',
  completions: 'dailycheck.completions.v1',
  timeEntries: 'dailycheck.timeEntries.v1',
} as const;

export function loadTasks(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEYS.tasks);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = TasksSchema.safeParse(parsed);
    return result.success ? (result.data as unknown as Task[]) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

export function loadCompletions(): Completion[] {
  const raw = localStorage.getItem(STORAGE_KEYS.completions);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = CompletionsSchema.safeParse(parsed);
    return result.success ? (result.data as unknown as Completion[]) : [];
  } catch {
    return [];
  }
}

export function saveCompletions(items: Completion[]): void {
  localStorage.setItem(STORAGE_KEYS.completions, JSON.stringify(items));
}

export function loadTimeEntries(): TimeEntry[] {
  const raw = localStorage.getItem(STORAGE_KEYS.timeEntries);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = TimeEntriesSchema.safeParse(parsed);
    return result.success ? (result.data as unknown as TimeEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveTimeEntries(items: TimeEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.timeEntries, JSON.stringify(items));
}
