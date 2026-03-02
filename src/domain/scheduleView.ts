import type { DayOfWeek, Task } from './types';

// (role: day schedule item, type: interface)
export interface DayScheduleItem {
  taskId: string; // (role: task id, type: string)
  title: string; // (role: task title, type: string)
  durationMinutes: number; // (role: planned minutes, type: number)
  category: Task['category']; // (role: category, type: Task['category'])
  isActive: boolean; // (role: active flag, type: boolean)
}

// (role: schedule by day-of-week, type: Record)
export type WeekSchedule = Record<DayOfWeek, DayScheduleItem[]>;

// (role: fixed day order, type: DayOfWeek[])
export const WEEK_ORDER: DayOfWeek[] = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

// (role: day label map, type: Record)
export const WEEK_LABEL_KO: Record<DayOfWeek, string> = {
  Mon: '월',
  Tue: '화',
  Wed: '수',
  Thu: '목',
  Fri: '금',
  Sat: '토',
  Sun: '일',
};

// (role: build week schedule view model, type: (Task[], boolean)=>WeekSchedule)
export function buildWeekSchedule(
  tasks: Task[],
  options?: {
    includeArchived?: boolean; // (role: include inactive tasks, type: boolean | undefined)
  },
): WeekSchedule {
  const includeArchived = options?.includeArchived ?? false;

  // 초기화
  const base: WeekSchedule = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  };

  const filtered = includeArchived ? tasks : tasks.filter((t) => t.isActive);

  for (const t of filtered) {
    for (const dow of t.daysOfWeek) {
      base[dow].push({
        taskId: t.id,
        title: t.title,
        durationMinutes: t.durationMinutes,
        category: t.category,
        isActive: t.isActive,
      });
    }
  }

  // 보기 좋게 정렬: (1) active 먼저, (2) category, (3) title
  for (const dow of WEEK_ORDER) {
    base[dow] = [...base[dow]].sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      if (a.category !== b.category)
        return String(a.category).localeCompare(String(b.category));
      return a.title.localeCompare(b.title);
    });
  }

  return base;
}
