// (role: day-of-week token, type: union)
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

// (role: category discriminator, type: union)
export type Category = 'weekday' | 'weekend' | 'daily' | 'custom';

// (role: base fields shared by all tasks, type: interface)
export interface TaskBase {
  id: string; // (role: task id, type: string)
  title: string; // (role: task title, type: string)
  category: Category; // (role: schedule rule, type: Category)
  daysOfWeek: readonly DayOfWeek[]; // (role: schedule days, type: readonly DayOfWeek[])
  durationMinutes: number; // (role: planned duration, type: minutes)
  isActive: boolean; // (role: archive flag, type: boolean)
  createdAt: string; // (role: ISO timestamp, type: string)
}

// (role: unified task type, type: alias)
export type Task = TaskBase;

// (role: completion record, type: interface)
export interface Completion {
  taskId: string; // (role: completed task id, type: string)
  date: string; // (role: YYYY-MM-DD, type: string)
}

// (role: time tracking record, type: interface)
export interface TimeEntry {
  id: string; // (role: time entry id, type: string)
  taskId: string; // (role: task id, type: string)
  date: string; // (role: YYYY-MM-DD, type: string)
  startedAt: string; // (role: ISO timestamp, type: string)
  endedAt: string | null; // (role: ISO timestamp or null if running, type: string | null)
  minutes: number; // (role: computed minutes, type: number)
}
