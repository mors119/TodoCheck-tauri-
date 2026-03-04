import { create } from 'zustand';
import type {
  Category,
  Completion,
  DayOfWeek,
  Task,
  TaskDailyMemo,
  TimeEntry,
} from '../../domain/types';
import {
  loadCompletions,
  loadTaskDailyMemos,
  loadTasks,
  loadTimeEntries,
  saveCompletions,
  saveTaskDailyMemos,
  saveTasks,
  saveTimeEntries,
} from '../../infra/storage';
import { diffMinutes, toYmd } from '../../domain/date';
import {
  shouldAutoArchive,
  toggleCompletion as toggleCompletionDomain,
} from '../../domain/completion';
import { createTaskEntity } from '../../domain/taskFactory';
import { getNotifier } from '../di/notifierDI';
import { upsertDailyMemo } from '../../domain/memo';

// (role: filter type, type: union)
export type Filter = 'all' | Category;

// (role: store state shape, type: interface)
interface DailyCheckState {
  tasks: Task[]; // (role: task list, type: Task[])
  completions: Completion[]; // (role: completion logs, type: Completion[])
  timeEntries: TimeEntry[]; // (role: time tracking logs, type: TimeEntry[])
  taskDailyMemos: TaskDailyMemo[]; // (role: per-task daily memos, type: TaskDailyMemo[])
  filter: Filter; // (role: active filter, type: Filter)
  errorMsg: string; // (role: user-facing error message, type: string)

  setFilter: (filter: Filter) => void; // (role: set filter, type: (Filter)=>void)
  clearError: () => void; // (role: clear error, type: ()=>void)

  createTask: (input: {
    title: string; // (role: title, type: string)
    description: string; // (role: persistent description, type: string)
    category: Category; // (role: schedule category, type: Category)
    durationMinutes: number; // (role: planned minutes, type: number)
    startYmd?: string | null; // (role: first eligible date, type: string | null | undefined)
    autoArchiveAfter?: number | null; // (role: threshold, type: number | null | undefined)
    customDays?: DayOfWeek[]; // (role: custom days, type: DayOfWeek[] | undefined)
  }) => void;

  updateTaskMeta: (input: {
    taskId: string;
    title: string;
    description: string;
    startYmd?: string | null;
    autoArchiveAfter?: number | null;
  }) => void;

  archiveTask: (taskId: string) => void; // (role: archive task, type: (string)=>void)
  restoreTask: (taskId: string) => void; // (role: restore archived task, type: (string)=>void)
  deleteTask: (taskId: string) => void; // (role: hard delete, type: (string)=>void)

  toggleToday: (input: { taskId: string; today: Date }) => void; // (role: toggle completion, type: (args)=>void)

  setDailyMemo: (input: {
    taskId: string;
    date: string;
    text: string;
  }) => void;

  startTimer: (input: { taskId: string; today: Date }) => void; // (role: start time tracking, type: (args)=>void)
  stopTimer: (input: { taskId: string; today: Date }) => void; // (role: stop time tracking, type: (args)=>void)

  autoStopIfReached: (input: { today: Date }) => string[]; // (role: auto stop+complete, type: (args)=>string[])
}

// (role: id generator, type: () => string)
function uid(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export const useDailyCheckStore = create<DailyCheckState>((set, get) => ({
  tasks: loadTasks(),
  completions: loadCompletions(),
  timeEntries: loadTimeEntries(),
  taskDailyMemos: loadTaskDailyMemos(),
  filter: 'all',
  errorMsg: '',

  setFilter: (filter) => set({ filter }),
  clearError: () => set({ errorMsg: '' }),

  createTask: ({
    title,
    description,
    category,
    durationMinutes,
    startYmd,
    autoArchiveAfter,
    customDays,
  }) => {
    const t = title.trim();
    if (!t) {
      set({ errorMsg: 'Title is required.' });
      return;
    }

    const createdAtYmd = toYmd(new Date());
    const normalizedStartYmd =
      startYmd == null || String(startYmd).trim() === ''
        ? null
        : String(startYmd).trim();
    if (normalizedStartYmd && normalizedStartYmd < createdAtYmd) {
      set({ errorMsg: 'Start date cannot be earlier than created date.' });
      return;
    }

    try {
      const task = createTaskEntity({
        id: uid(),
        title: t,
        description,
        category,
        customDays,
        durationMinutes,
        startYmd: normalizedStartYmd,
        autoArchiveAfter,
        nowIso: new Date().toISOString(),
      });

      const next = [task, ...get().tasks];
      saveTasks(next);
      set({ tasks: next, errorMsg: '' });
    } catch (e) {
      set({
        errorMsg: e instanceof Error ? e.message : 'Failed to create task.',
      });
    }
  },

  updateTaskMeta: ({ taskId, title, description, startYmd, autoArchiveAfter }) => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      set({ errorMsg: 'Title is required.' });
      return;
    }

    const numericThreshold =
      autoArchiveAfter == null ? null : Number(autoArchiveAfter);
    const normalizedThreshold =
      numericThreshold == null ||
      !Number.isInteger(numericThreshold) ||
      numericThreshold < 1
        ? null
        : numericThreshold;

    const normalizedStartYmdRaw =
      startYmd == null ? null : String(startYmd).trim();
    const normalizedStartYmd =
      normalizedStartYmdRaw == null || normalizedStartYmdRaw === ''
        ? null
        : /^\d{4}-\d{2}-\d{2}$/.test(normalizedStartYmdRaw)
          ? normalizedStartYmdRaw
          : null;
    const targetTask = get().tasks.find((task) => task.id === taskId);
    if (!targetTask) {
      set({ errorMsg: 'Task not found.' });
      return;
    }

    const createdAtYmd = targetTask.createdAt.slice(0, 10);
    if (normalizedStartYmd && normalizedStartYmd < createdAtYmd) {
      set({ errorMsg: 'Start date cannot be earlier than created date.' });
      return;
    }

    const next = get().tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            title: normalizedTitle,
            description: description.trim(),
            startYmd: normalizedStartYmd,
            autoArchiveAfter: normalizedThreshold,
          }
        : task,
    );

    saveTasks(next);
    set({ tasks: next, errorMsg: '' });
  },

  archiveTask: (taskId) => {
    const next = get().tasks.map((t) =>
      t.id === taskId ? { ...t, isActive: false } : t,
    );
    saveTasks(next);
    set({ tasks: next, errorMsg: '' });
  },

  restoreTask: (taskId) => {
    const next = get().tasks.map((t) =>
      t.id === taskId ? { ...t, isActive: true } : t,
    );
    saveTasks(next);
    set({ tasks: next, errorMsg: '' });
  },

  deleteTask: (taskId) => {
    const nextTasks = get().tasks.filter((t) => t.id !== taskId);
    const nextCompletions = get().completions.filter(
      (c) => c.taskId !== taskId,
    );
    const nextTimeEntries = get().timeEntries.filter(
      (e) => e.taskId !== taskId,
    );
    const nextMemos = get().taskDailyMemos.filter((m) => m.taskId !== taskId);

    saveTasks(nextTasks);
    saveCompletions(nextCompletions);
    saveTimeEntries(nextTimeEntries);
    saveTaskDailyMemos(nextMemos);

    set({
      tasks: nextTasks,
      completions: nextCompletions,
      timeEntries: nextTimeEntries,
      taskDailyMemos: nextMemos,
      errorMsg: '',
    });
  },

  toggleToday: ({ taskId, today }) => {
    const date = toYmd(today);

    const prevCompletions = get().completions;
    const nextCompletions = toggleCompletionDomain(
      prevCompletions,
      taskId,
      date,
    );

    const wasDone = prevCompletions.some(
      (c) => c.taskId === taskId && c.date === date,
    );

    let nextTimeEntries = get().timeEntries;
    let nextTasks = get().tasks;

    // 완료가 해제된 경우 -> 오늘 타이머 기록 삭제
    if (wasDone) {
      nextTimeEntries = nextTimeEntries.filter(
        (e) => !(e.taskId === taskId && e.date === date),
      );
    } else {
      const toggledTask = nextTasks.find((t) => t.id === taskId);
      if (
        toggledTask &&
        toggledTask.isActive &&
        shouldAutoArchive(toggledTask, nextCompletions)
      ) {
        nextTasks = nextTasks.map((task) =>
          task.id === taskId ? { ...task, isActive: false } : task,
        );

        const notifier = getNotifier();
        notifier.notify({
          level: 'info',
          message: `Auto-archived: ${toggledTask.title}`,
        });
      }
    }

    saveCompletions(nextCompletions);
    saveTimeEntries(nextTimeEntries);
    if (nextTasks !== get().tasks) {
      saveTasks(nextTasks);
    }

    set({
      tasks: nextTasks,
      completions: nextCompletions,
      timeEntries: nextTimeEntries,
      errorMsg: '',
    });
  },

  setDailyMemo: ({ taskId, date, text }) => {
    const next = upsertDailyMemo(get().taskDailyMemos, {
      taskId,
      date,
      text,
      updatedAt: new Date().toISOString(),
    });

    saveTaskDailyMemos(next);
    set({ taskDailyMemos: next, errorMsg: '' });
  },

  startTimer: ({ taskId, today }) => {
    const date = toYmd(today);
    const nowIso = new Date().toISOString();

    const entries = get().timeEntries;

    // 0) 이미 이 task가 오늘 running이면: 중복 start 방지
    const alreadyRunningSameTask = entries.some(
      (e) => e.taskId === taskId && e.date === date && e.endedAt == null,
    );
    if (alreadyRunningSameTask) {
      set({ errorMsg: 'Timer is already running for this task today.' });
      return;
    }

    // 1) 오늘 running인 다른 타이머들 stop 처리 (단일 실행 정책)
    const next = entries.map((e) => {
      if (e.date !== date) return e;
      if (e.endedAt != null) return e; // already ended

      // 여기까지 오면 "오늘 running"임 -> 종료 처리
      const minutes = diffMinutes(e.startedAt, nowIso);
      return { ...e, endedAt: nowIso, minutes };
    });

    // 2) 새 running entry 생성
    const entry: TimeEntry = {
      id: uid(),
      taskId,
      date,
      startedAt: nowIso,
      endedAt: null,
      minutes: 0,
    };

    const nextWithNew = [entry, ...next];

    saveTimeEntries(nextWithNew);
    set({ timeEntries: nextWithNew, errorMsg: '' });
  },

  stopTimer: ({ taskId, today }) => {
    const date = toYmd(today);

    const idx = get().timeEntries.findIndex(
      (e) => e.taskId === taskId && e.date === date && e.endedAt == null,
    );
    if (idx === -1) {
      set({ errorMsg: 'No running timer for this task today.' });
      return;
    }

    const nowIso = new Date().toISOString();
    const cur = get().timeEntries[idx];
    const minutes = diffMinutes(cur.startedAt, nowIso);

    const updated: TimeEntry = { ...cur, endedAt: nowIso, minutes };

    const next = [...get().timeEntries];
    next[idx] = updated;

    saveTimeEntries(next);
    set({ timeEntries: next, errorMsg: '' });
  },

  autoStopIfReached: ({ today }) => {
    const date = toYmd(today);
    const nowIso = new Date().toISOString();

    const entries = get().timeEntries;
    const tasks = get().tasks;

    const nextEntries = [...entries];
    const nextCompletions = [...get().completions];
    const finishedTaskTitles: string[] = [];
    let changed = false;

    // 오늘 running entry들만 스캔
    for (let i = 0; i < nextEntries.length; i += 1) {
      const e = nextEntries[i];

      if (e.date !== date) continue;
      if (e.endedAt != null) continue;

      const task = tasks.find((t) => t.id === e.taskId);
      if (!task) continue;

      // 오늘 누적(끝난 기록 합) + 현재 running 경과분
      const doneMinutes = nextEntries
        .filter(
          (x) =>
            x.taskId === e.taskId &&
            x.date === date &&
            x.endedAt != null &&
            Number.isFinite(x.minutes),
        )
        .reduce((acc, x) => acc + (x.minutes || 0), 0);

      const runningMinutes = diffMinutes(e.startedAt, nowIso);
      const total = doneMinutes + runningMinutes;

      if (total >= task.durationMinutes) {
        nextEntries[i] = { ...e, endedAt: nowIso, minutes: runningMinutes };
        finishedTaskTitles.push(task.title);
        changed = true;

        const notifier = getNotifier();
        notifier.notify({
          level: 'info',
          message: `Auto-stopped: ${task.title} (+${runningMinutes}m)`,
        });

        const alreadyDone = nextCompletions.some(
          (c) => c.taskId === e.taskId && c.date === date,
        );

        if (!alreadyDone) {
          nextCompletions.push({ taskId: e.taskId, date });

          notifier.notify({
            level: 'success',
            message: `Auto-completed: ${task.title}`,
          });
        }
      }
    }

    if (!changed) return [];

    saveTimeEntries(nextEntries);
    saveCompletions(nextCompletions);

    set({
      timeEntries: nextEntries,
      completions: nextCompletions,
      errorMsg: '',
    });

    return finishedTaskTitles;
  },
}));
