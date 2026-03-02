export const ko = {
  common: {
    today: '오늘',
    manage: '관리',
    schedule: '일정',
    settings: '설정',
    add: '추가',
    reset: '초기화',
    all: '전체',
    weekday: '평일',
    weekend: '주말',
    daily: '매일',
    custom: '사용자 지정',
    archived: '보관됨',
    running: '실행 중',
    time: '시간',
    completion: '완료율',
  },

  task: {
    createTask: '작업 만들기',
    createTaskHelp: '반복 규칙과 시간을 설정해 작업을 추가하세요.',
    title: '제목',
    titlePlaceholder: '예: 운동',
    schedule: '일정',
    days: '요일',
    plan: '계획',
    todaySpent: '오늘',
    todayTasksDescription: '오늘 일정에 포함된 작업만 표시됩니다.',
    manageTasks: '작업 관리',
    manageTasksDescription: '현재 필터가 적용된 작업 목록입니다.',
    filters: '필터',
    filtersDescription: '작업이 많아질 때 검색과 필터를 사용하세요.',
    search: '검색',
    searchPlaceholder: '제목으로 검색...',
    category: '카테고리',
    viewOptions: '보기 옵션',
    showArchived: '보관된 항목 보기',
    showingArchived: '보관된 항목 표시 중',
    addScheduleCustom: '사용자 지정 (요일 선택)',
    addScheduleDaily: '매일 (월-일)',
    addScheduleWeekday: '평일 (월-금)',
    addScheduleWeekend: '주말 (토-일)',
    pickDays: '요일 선택',
    customCheckableNote:
      '사용자 지정 작업은 선택한 요일에만 체크할 수 있습니다.',
    validation: {
      titleRequired: '제목은 필수입니다.',
      titleTooLong: '제목이 너무 깁니다 (최대 80자).',
      durationMin: '시간은 최소 1분 이상이어야 합니다.',
      durationTooLarge: '시간이 너무 큽니다.',
      pickOneDay: '최소 하루 이상 선택하세요.',
    },
    archive: '보관',
    restore: '복원',
    delete: '삭제',
    todayTasks: '오늘의 작업',
    noTasks: '작업이 없습니다.',
    noTasksScheduledToday: '오늘 예정된 작업이 없습니다.',
    noTasksScheduledManage: '현재 필터에 맞는 작업이 없습니다.',
    noTasksInSchedule: '예정된 작업이 없습니다.',
  },

  stats: {
    scheduledToday: '오늘 예정',
    done: '완료',
    weeklyStats: '주간 통계',
    totalCompletionRate: '전체 완료율',
    weekdayCompletionRate: '평일 완료율',
    weekendCompletionRate: '주말 완료율',
    dailyCompletionRate: '매일 완료율',
    customCompletionRate: '사용자 지정 완료율',
    weekStart: '주 시작일',
    mvpRule:
      'MVP 규칙: 한 주 내에 1회 이상 체크되면 해당 작업은 주간 완료로 계산됩니다.',
  },

  time: {
    durationMin: '시간 (분)',
    basedOnTodayPlannedMinutes: '오늘 계획된 시간(분) 기준입니다.',
    start: '시작',
    stop: '중지',
    hourShort: '시간',
    minuteShort: '분',
    day: {
      Mon: '월',
      Tue: '화',
      Wed: '수',
      Thu: '목',
      Fri: '금',
      Sat: '토',
      Sun: '일',
    },
  },

  period: {
    allTime: '전체 기간',
    thisMonth: '이번 달',
    thisWeek: '이번 주',
    basedOnScheduledVsChecked: '일정된 작업일 대비 체크된 작업일 기준입니다.',
  },

  empty: {
    notScheduledToday: '(오늘 일정 아님)',
  },

  note: {
    clickToDismiss: '클릭하여 닫기',
    scheduleDescription:
      '한눈에 보는 주간 일정입니다. 넓은 화면(7열)에서는 블록 높이가 소요 시간에 따라 커집니다(최소 1시간). 완료 항목은 완료된 정확한 날짜에만 강조됩니다.',
    nextPlan:
      '다음: 작업 편집(제목/카테고리/요일)과 Tauri의 SQLite 마이그레이션.',
    deleteConfirm: '"{title}" 작업을 영구 삭제할까요?\n되돌릴 수 없습니다.',
    taskNotScheduledToday: '이 작업은 오늘 일정에 없습니다.',
  },

  settings: {
    language: {
      title: '언어',
      desc: '앱에서 표시할 언어를 선택하세요.',
      options: {
        en: 'English',
        ko: '한국어',
        ja: '日本語',
      },
    },
  },
};
