export const en = {
  common: {
    today: 'Today',
    manage: 'Manage',
    schedule: 'Schedule',
    settings: 'Settings',
    add: 'Add',
    reset: 'Reset',
    all: 'All',
    weekday: 'Weekday',
    weekend: 'Weekend',
    daily: 'Daily',
    custom: 'Custom',
    archived: 'Archived',
    running: 'Running',
    time: 'Time',
    completion: 'Completion',
  },

  task: {
    createTask: 'Create task',
    createTaskHelp: 'Choose a schedule rule, duration, and add a task.',
    title: 'Title',
    titlePlaceholder: 'e.g. Exercise',
    schedule: 'Schedule',
    days: 'Days',
    plan: 'Plan',
    todaySpent: 'Today',
    todayTasksDescription: 'Only tasks scheduled for today are shown here.',
    manageTasks: 'Manage tasks',
    manageTasksDescription: 'Your tasks list with the current filters.',
    filters: 'Filters',
    filtersDescription: 'Search and filter when tasks grow.',
    search: 'Search',
    searchPlaceholder: 'Search by title...',
    category: 'Category',
    viewOptions: 'View options',
    showArchived: 'Show archived',
    showingArchived: 'Showing archived',
    addScheduleCustom: 'custom (pick days)',
    addScheduleDaily: 'daily (Mon-Sun)',
    addScheduleWeekday: 'weekday (Mon-Fri)',
    addScheduleWeekend: 'weekend (Sat-Sun)',
    pickDays: 'Pick days',
    customCheckableNote:
      'Custom tasks are only checkable on the selected days.',
    validation: {
      titleRequired: 'Title is required.',
      titleTooLong: 'Title is too long (max 80).',
      durationMin: 'Duration must be >= 1 minute.',
      durationTooLarge: 'Duration too large.',
      pickOneDay: 'Pick at least one day.',
    },
    archive: 'Archive',
    restore: 'Restore',
    delete: 'Delete',
    todayTasks: "Today's tasks",
    noTasks: 'No tasks.',
    noTasksScheduledToday: 'No tasks scheduled for today.',
    noTasksScheduledManage: 'No tasks match the current filters.',
    noTasksInSchedule: 'No tasks scheduled.',
  },

  stats: {
    scheduledToday: 'Scheduled today',
    done: 'Done',
    weeklyStats: 'Weekly stats',
    totalCompletionRate: 'Total completion rate',
    weekdayCompletionRate: 'Weekday completion rate',
    weekendCompletionRate: 'Weekend completion rate',
    dailyCompletionRate: 'Daily completion rate',
    customCompletionRate: 'Custom completion rate',
    weekStart: 'Week start',
    mvpRule:
      'MVP rule: A task counts as completed for the week if it has at least one check within the week.',
  },

  time: {
    durationMin: 'Duration (min)',
    basedOnTodayPlannedMinutes: "Based on today's planned minutes.",
    start: 'Start',
    stop: 'Stop',
    hourShort: 'h',
    minuteShort: 'm',
    day: {
      Mon: 'Mon',
      Tue: 'Tue',
      Wed: 'Wed',
      Thu: 'Thu',
      Fri: 'Fri',
      Sat: 'Sat',
      Sun: 'Sun',
    },
  },

  period: {
    allTime: 'All time',
    thisMonth: 'This month',
    thisWeek: 'This week',
    basedOnScheduledVsChecked:
      'Based on scheduled task-days vs checked task-days.',
  },

  empty: {
    notScheduledToday: '(not scheduled today)',
  },

  note: {
    clickToDismiss: 'Click to dismiss',
    scheduleDescription:
      'A week-at-a-glance view. On wide screens (7 columns), block height scales by duration (minimum 1 hour). Completed items are highlighted only on the exact day they were completed.',
    nextPlan:
      'Next: edit task (title/category/days), and SQLite migration on Tauri.',
    deleteConfirm: 'Delete "{title}" permanently?\nThis cannot be undone.',
    taskNotScheduledToday: 'This task is not scheduled for today.',
  },

  settings: {
    language: {
      title: 'Language',
      desc: 'Choose the display language for the app.',
      options: {
        en: 'English',
        ko: 'Korean',
        ja: 'Japanese',
      },
    },
  },
};
