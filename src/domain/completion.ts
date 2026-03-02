import type { Completion } from './types';

// (role: toggle completion for (taskId, date), type: (Completion[], string, string) => Completion[])
export function toggleCompletion(
  completions: Completion[],
  taskId: string,
  date: string,
): Completion[] {
  const exists = completions.some(
    (c) => c.taskId === taskId && c.date === date,
  );
  if (exists) {
    return completions.filter((c) => !(c.taskId === taskId && c.date === date));
  }
  return [...completions, { taskId, date }];
}

// (role: check if task completed on a date, type: (Completion[], string, string) => boolean)
export function isDoneOn(
  completions: Completion[],
  taskId: string,
  date: string,
): boolean {
  return completions.some((c) => c.taskId === taskId && c.date === date);
}
