export const ja = {
  common: {
    today: '今日',
    manage: '管理',
    schedule: 'スケジュール',
    settings: '設定',
    add: '追加',
    reset: 'リセット',
    all: 'すべて',
    weekday: '平日',
    weekend: '週末',
    daily: '毎日',
    custom: 'カスタム',
    archived: 'アーカイブ済み',
    running: '実行中',
    time: '時間',
    completion: '達成率',
  },

  task: {
    createTask: 'タスク作成',
    createTaskHelp: '繰り返しルールと時間を設定してタスクを追加します。',
    title: 'タイトル',
    titlePlaceholder: '例: 運動',
    schedule: '予定',
    days: '曜日',
    plan: '計画',
    todaySpent: '今日',
    todayTasksDescription: 'ここには今日予定されているタスクのみ表示されます。',
    manageTasks: 'タスク管理',
    manageTasksDescription: '現在のフィルターが適用されたタスクリストです。',
    filters: 'フィルター',
    filtersDescription: 'タスクが増えたら検索とフィルターを使ってください。',
    search: '検索',
    searchPlaceholder: 'タイトルで検索...',
    category: 'カテゴリ',
    viewOptions: '表示オプション',
    showArchived: 'アーカイブを表示',
    showingArchived: 'アーカイブ表示中',
    addScheduleCustom: 'カスタム (曜日を選択)',
    addScheduleDaily: '毎日 (月-日)',
    addScheduleWeekday: '平日 (月-金)',
    addScheduleWeekend: '週末 (土-日)',
    pickDays: '曜日を選択',
    customCheckableNote: 'カスタムタスクは選択した曜日のみチェックできます。',
    validation: {
      titleRequired: 'タイトルは必須です。',
      titleTooLong: 'タイトルが長すぎます (最大80文字)。',
      durationMin: '時間は1分以上である必要があります。',
      durationTooLarge: '時間が大きすぎます。',
      pickOneDay: '少なくとも1日選択してください。',
    },
    archive: 'アーカイブ',
    restore: '復元',
    delete: '削除',
    todayTasks: '今日のタスク',
    noTasks: 'タスクがありません。',
    noTasksScheduledToday: '今日予定されているタスクはありません。',
    noTasksScheduledManage: '現在のフィルターに一致するタスクはありません。',
    noTasksInSchedule: '予定されているタスクはありません。',
  },

  stats: {
    scheduledToday: '今日の予定',
    done: '完了',
    weeklyStats: '週間統計',
    totalCompletionRate: '全体の達成率',
    weekdayCompletionRate: '平日の達成率',
    weekendCompletionRate: '週末の達成率',
    dailyCompletionRate: '毎日の達成率',
    customCompletionRate: 'カスタムの達成率',
    weekStart: '週の開始日',
    mvpRule:
      'MVPルール: 週内で1回以上チェックがあれば、そのタスクは週の完了として計算されます。',
  },

  time: {
    durationMin: '時間 (分)',
    basedOnTodayPlannedMinutes: '今日の予定時間(分)を基準にしています。',
    start: '開始',
    stop: '停止',
    hourShort: '時間',
    minuteShort: '分',
    day: {
      Mon: '月',
      Tue: '火',
      Wed: '水',
      Thu: '木',
      Fri: '金',
      Sat: '土',
      Sun: '日',
    },
  },

  period: {
    allTime: '全期間',
    thisMonth: '今月',
    thisWeek: '今週',
    basedOnScheduledVsChecked:
      '予定されたタスク日とチェックされたタスク日を基準にしています。',
  },

  empty: {
    notScheduledToday: '(今日は予定なし)',
  },

  note: {
    clickToDismiss: 'クリックで閉じる',
    scheduleDescription:
      '週全体を一覧できる表示です。広い画面(7列)では、ブロックの高さが所要時間に応じて変化します(最小1時間)。完了項目は完了した当日のみ強調表示されます。',
    nextPlan:
      '次: タスク編集(タイトル/カテゴリ/曜日)と Tauri の SQLite マイグレーション。',
    deleteConfirm:
      '"{title}" を完全に削除しますか?\nこの操作は元に戻せません。',
    taskNotScheduledToday: 'このタスクは今日の予定ではありません。',
  },

  settings: {
    language: {
      title: '言語',
      desc: 'アプリの表示言語を選択してください。',
      options: {
        en: 'English',
        ko: '한국어',
        ja: '日本語',
      },
    },
  },
};
