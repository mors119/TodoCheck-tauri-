import { useEffect, useMemo, useState } from 'react';
import { useDailyCheckStore } from '../store/useDailyCheckStore';
import { dayOfWeek, startOfWeekMonday, toYmd } from '../../domain/date';
import { calcTodayStats, calcWeekStats } from '../../domain/stats';
import { isDoneOn } from '../../domain/completion';
import type { Task } from '../../domain/types';
import type { Tab } from '../layout/HeaderTabs';
import type { CreateTaskInput } from '../components/TaskForm';
import { getNotifier } from '../di/notifierDI';

export function useAppModel() {
  const {
    tasks,
    completions,
    timeEntries,
    errorMsg,
    clearError,
    createTask,
    archiveTask,
    restoreTask,
    deleteTask,
    toggleToday,
    startTimer,
    stopTimer,
  } = useDailyCheckStore();

  const [tab, setTab] = useState<Tab>('today');

  // Toast
  const notifier = getNotifier();

  // Manage controls
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [manageQuery, setManageQuery] = useState<string>('');
  const [manageCategory, setManageCategory] = useState<
    'all' | Task['category']
  >('all');

  // UI clock tick (30s). Used to keep "Today: Xm" increasing without per-item intervals.
  // (role: ui clock iso, type: string)
  const [nowIso, setNowIso] = useState<string>(() => new Date().toISOString());

  useEffect(() => {
    const id = window.setInterval(() => {
      setNowIso(new Date().toISOString());
    }, 30000);

    return () => window.clearInterval(id);
  }, []);

  // Derive "today" from ui clock so day changes (midnight) are reflected.
  const today = useMemo(() => new Date(nowIso), [nowIso]);
  const todayYmd = toYmd(today);
  const todayDow = dayOfWeek(today);
  const weekStartYmd = toYmd(startOfWeekMonday(today));

  // Single running timer (today). Store enforces 1 running entry per day.
  // (role: single running task id for today, type: string | null)
  const runningTaskIdToday = useMemo(() => {
    const running = timeEntries.find(
      (e) => e.date === todayYmd && e.endedAt == null,
    );
    return running?.taskId ?? null;
  }, [timeEntries, todayYmd]);

  const weekStats = useMemo(
    () => calcWeekStats(tasks, completions, weekStartYmd),
    [tasks, completions, weekStartYmd],
  );

  const todayStats = useMemo(
    () => calcTodayStats(tasks, completions, todayYmd, todayDow),
    [tasks, completions, todayYmd, todayDow],
  );

  const todayTasks = useMemo(() => {
    const filtered = tasks.filter(
      (t) => t.isActive && t.daysOfWeek.includes(todayDow),
    );
    return [...filtered].sort((a, b) => {
      const aDone = isDoneOn(completions, a.id, todayYmd);
      const bDone = isDoneOn(completions, b.id, todayYmd);
      if (aDone === bDone) return 0;
      return aDone ? 1 : -1;
    });
  }, [tasks, completions, todayDow, todayYmd]);

  const manageTasks = useMemo(() => {
    const base = showArchived
      ? tasks.filter((t) => !t.isActive)
      : tasks.filter((t) => t.isActive);

    const byCategory =
      manageCategory === 'all'
        ? base
        : base.filter((t) => t.category === manageCategory);

    const q = manageQuery.trim().toLowerCase();
    if (!q) return byCategory;

    return byCategory.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, showArchived, manageCategory, manageQuery]);

  const setError = (msg: string) =>
    useDailyCheckStore.setState({ errorMsg: msg });

  // Handlers
  const handleCreate = (input: CreateTaskInput) => {
    createTask(input);
    notifier.notify({
      level: 'success',
      message: `Task created: ${input.title}`,
    });
  };

  const handleRestore = (taskId: string) => {
    restoreTask(taskId);
    setShowArchived(false);
    notifier.notify({
      level: 'success',
      message: `Task restored`,
    });
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
    notifier.notify({
      level: 'success',
      message: `Task deleted permanently`,
    });
  };

  const handleResetManage = () => {
    setManageQuery('');
    setManageCategory('all');
    setShowArchived(false);
  };

  // 실시간을 위해 today(useMemo) 대신 현재 날짜 받기
  const handleStartTimer = (task: Task) => {
    startTimer({ taskId: task.id, today: new Date() });

    notifier.notify({
      level: 'info',
      message: `Timer started`,
    });
  };

  const handleStopTimer = (task: Task) => {
    stopTimer({ taskId: task.id, today: new Date() });
    notifier.notify({
      level: 'info',
      message: `Timer stopped`,
    });
  };

  return {
    // raw
    tasks,
    completions,
    timeEntries,
    errorMsg,

    // time
    today,
    todayYmd,
    todayDow,
    nowIso,
    runningTaskIdToday,

    // view state
    tab,
    setTab,

    // manage state
    showArchived,
    setShowArchived,
    manageQuery,
    setManageQuery,
    manageCategory,
    setManageCategory,

    // derived
    weekStats,
    todayStats,
    todayTasks,
    manageTasks,

    // actions
    clearError,
    setError,
    handleCreate,
    archiveTask,
    toggleToday,
    handleRestore,
    handleDelete,
    handleResetManage,

    // timer actions (UI용)
    handleStartTimer,
    handleStopTimer,
  };
}
