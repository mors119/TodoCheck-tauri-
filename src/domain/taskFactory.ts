import type { Category, DayOfWeek, Task } from './types';
import { FIXED_DAYS } from './schedule';

export function createTaskEntity(args: {
  id: string; // (role: task id, type: string)
  title: string; // (role: title, type: string)
  category: Category; // (role: schedule category, type: Category)
  customDays?: DayOfWeek[]; // (role: custom days, type: DayOfWeek[] | undefined)
  durationMinutes: number; // (role: planned minutes, type: number)
  nowIso: string; // (role: created timestamp, type: ISO string)
}): Task {
  const title = args.title.trim();
  if (!title) throw new Error('Title is required.');

  const durationMinutes = Math.max(1, Math.floor(args.durationMinutes || 0));
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    throw new Error('Duration must be a positive number (minutes).');
  }

  let daysOfWeek: readonly DayOfWeek[];

  if (args.category === 'custom') {
    const days = (args.customDays ?? []).filter(Boolean);
    if (days.length === 0) throw new Error('Pick at least one day for custom.');
    daysOfWeek = [...new Set(days)];
  } else {
    daysOfWeek = FIXED_DAYS[args.category];
  }

  return {
    id: args.id,
    title,
    category: args.category,
    daysOfWeek,
    durationMinutes,
    isActive: true,
    createdAt: args.nowIso,
  };
}
