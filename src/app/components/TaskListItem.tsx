import { useContext } from 'react';
import type {
  Completion,
  DayOfWeek,
  Task,
  TimeEntry,
} from '../../domain/types';
import { isDoneOn } from '../../domain/completion';
import { isScheduledOn } from '../../domain/schedule';
import { diffMinutes } from '../../domain/date';
import { Archive, Check, Pause, Play } from 'lucide-react';
import clsx from 'clsx';
import { LocaleContext } from '../../i18n/context';

interface TaskListItemProps {
  task: Task; // (role: task item, type: Task)
  completions: Completion[]; // (role: completion logs, type: Completion[])
  timeEntries: TimeEntry[]; // (role: time tracking logs, type: TimeEntry[])
  todayYmd: string; // (role: YYYY-MM-DD, type: string)
  todayDow: DayOfWeek; // (role: day-of-week, type: DayOfWeek)

  nowIso: string; // (role: ui clock iso, type: string)
  runningTaskIdToday: string | null; // (role: single running task id, type: string | null)

  variant: 'today' | 'manage'; // (role: UI behavior switch, type: union)
  onToggleToday: (task: Task) => void; // (role: toggle today's completion, type: (Task)=>void)
  onArchive: (taskId: string) => void; // (role: archive task, type: (string)=>void)
  onRestore?: (taskId: string) => void; // (role: restore handler, type: ((string)=>void) | undefined)
  onDelete?: (taskId: string) => void; // (role: hard delete handler, type: ((string)=>void) | undefined)
  onStartTimer: (task: Task) => void; // (role: start timer, type: (Task)=>void)
  onStopTimer: (task: Task) => void; // (role: stop timer, type: (Task)=>void)
  onError: (msg: string) => void; // (role: set error message, type: (string)=>void)
}

export function TaskListItem(props: TaskListItemProps) {
  const { t: tr } = useContext(LocaleContext);

  const {
    task,
    completions,
    timeEntries,
    todayYmd,
    todayDow,
    nowIso,
    runningTaskIdToday,
    variant,
    onToggleToday,
    onArchive,
    onRestore,
    onDelete,
    onStartTimer,
    onStopTimer,
    onError,
  } = props;

  const scheduledToday = isScheduledOn(task, todayDow);
  const doneToday = isDoneOn(completions, task.id, todayYmd);

  const safeTimeEntries = timeEntries ?? [];
  const todayEntries = safeTimeEntries.filter(
    (e) => e.taskId === task.id && e.date === todayYmd,
  );

  // Store policy: only ONE running entry per day.
  const running = runningTaskIdToday === task.id;

  const totalMinutesToday = todayEntries.reduce((acc, e) => {
    if (e.endedAt == null) return acc + diffMinutes(e.startedAt, nowIso);
    return acc + (e.minutes || 0);
  }, 0);

  const plannedMinutes = Math.max(0, task.durationMinutes || 0);

  // 진행률(0~1). 완료면 1로 처리(UX)
  const progress01 = doneToday
    ? 1
    : plannedMinutes === 0
      ? 0
      : Math.min(totalMinutesToday / plannedMinutes, 1);

  const progressPct = Math.round(progress01 * 100);
  const daysLabel = task.daysOfWeek.map((d) => tr(`time.day.${d}`)).join(', ');
  const categoryLabel = tr(`common.${task.category}`);

  return (
    <div
      className={clsx(
        'rounded-2xl border p-3 transition ',
        scheduledToday
          ? 'border-zinc-800 bg-zinc-950/40'
          : 'border-zinc-900 bg-zinc-950/20 opacity-80',
        variant == 'today' ? 'xl:px-5 xl:pt-5' : '',
      )}>
      <div className="flex flex-col md:gap-3 gap-2 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 w-full md:max-w-[64%]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-sm font-semibold text-zinc-100">
              {task.title}
            </div>

            <span className="rounded-full border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 text-xs text-zinc-300">
              {categoryLabel}
            </span>

            {!task.isActive && (
              <span className="rounded-full border border-zinc-700 bg-zinc-800/40 px-2 py-0.5 text-xs text-zinc-300">
                {tr('common.archived')}
              </span>
            )}
          </div>

          <div className="mt-1 text-xs text-zinc-500">
            <span
              className={clsx(
                variant == 'today' ? 'hidden md:inline-block' : 'inline-block',
              )}>
              {tr('task.days')}: {daysLabel} ·
            </span>{' '}
            {tr('task.plan')}: {task.durationMinutes}
            {tr('time.minuteShort')}{' '}
            <span
              className={clsx(variant == 'today' ? 'inline-block' : 'hidden')}>
              · {tr('task.todaySpent')}:{' '}
              {doneToday ? task.durationMinutes : totalMinutesToday}
              {tr('time.minuteShort')}
            </span>
            {running && (
              <span className="ml-2 text-emerald-200">
                {tr('common.running')}
              </span>
            )}
            {!scheduledToday && (
              <span className="ml-2 text-zinc-600">
                {tr('empty.notScheduledToday')}
              </span>
            )}
            {/* Progress bar */}
            <div
              className={clsx(
                'mt-2 h-2 w-full overflow-hidden rounded-full border border-zinc-800 bg-zinc-900/40',
                variant == 'manage' && 'hidden',
              )}>
              <div
                className="h-full rounded-full bg-zinc-300/30 transition-all"
                style={{ width: `${progressPct}%` }}
                aria-hidden="true"
              />
            </div>
            <div
              className={clsx(
                'mt-1 text-[11px] hidden  text-zinc-600 text-end',
                variant == 'today' && 'sm:block',
              )}>
              {progressPct}%
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-end md:justify-normal">
          {/* Timer */}
          {variant == 'today' && (
            <button
              type="button"
              onClick={() => {
                if (!scheduledToday) {
                  onError(tr('note.taskNotScheduledToday'));
                  return;
                }
                if (running) onStopTimer(task);
                else onStartTimer(task);
              }}
              disabled={!scheduledToday || doneToday}
              className={[
                'rounded-xl border px-3 py-2 text-sm transition min-w-18',
                running
                  ? 'border-rose-400/30 bg-rose-400/10 text-rose-200 hover:bg-rose-400/15'
                  : doneToday
                    ? 'border-zinc-800 bg-zinc-900/40 text-zinc-200 hover:bg-zinc-900/70'
                    : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15',
                'disabled:cursor-not-allowed disabled:opacity-60',
              ].join(' ')}>
              {running ? (
                <span role="button" className="flex items-center gap-1">
                  <Pause size={14} />
                  {tr('time.stop')}
                </span>
              ) : (
                <span role="button" className="flex items-center gap-1">
                  <Play size={14} />
                  {tr('time.start')}
                </span>
              )}
            </button>
          )}

          {/* Completion */}
          <button
            type="button"
            onClick={() => {
              if (!scheduledToday) {
                onError(tr('note.taskNotScheduledToday'));
                return;
              }
              onToggleToday(task);
            }}
            disabled={!scheduledToday}
            className={[
              'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition border',

              // 완료 상태 (조금 muted 느낌)
              doneToday
                ? 'border-zinc-700 bg-zinc-800/40 text-zinc-400'
                : 'border-zinc-800 bg-zinc-900/40 text-zinc-200 hover:bg-zinc-900/70',

              'disabled:cursor-not-allowed disabled:opacity-60',
            ].join(' ')}>
            {/* Checkbox */}
            <span
              className={[
                'flex items-center justify-center h-4 w-4 rounded border transition',

                doneToday
                  ? 'border-zinc-500 bg-zinc-600'
                  : 'border-zinc-600 bg-transparent',
              ].join(' ')}
              aria-hidden="true">
              {doneToday && <Check size={12} className="text-white" />}
            </span>
            {tr('stats.done')}
          </button>

          {/* Manage actions */}
          {variant === 'manage' && (
            <>
              {task.isActive && (
                <button
                  type="button"
                  onClick={() => onArchive(task.id)}
                  className="rounded-xl inline-flex items-center gap-1 border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900/70">
                  <Archive size={14} /> {tr('task.archive')}
                </button>
              )}

              {!task.isActive && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRestore?.(task.id)}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900/70">
                    {tr('task.restore')}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!onDelete) return;
                      const ok = window.confirm(
                        tr('note.deleteConfirm', { title: task.title }),
                      );
                      if (!ok) return;
                      onDelete(task.id);
                    }}
                    className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200 hover:bg-red-400/15">
                    {tr('task.delete')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
