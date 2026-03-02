import { useContext, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Category, DayOfWeek } from '../../domain/types';
import { ALL_DAYS } from '../../domain/schedule';
import { LocaleContext } from '../../i18n/context';

// (role: zod enum sources, type: readonly arrays)
const CATEGORY_VALUES = [
  'weekday',
  'weekend',
  'daily',
  'custom',
] as const satisfies readonly Category[];
const DAY_VALUES = ALL_DAYS as readonly DayOfWeek[];

// (role: preprocess numeric inputs safely, type: (unknown)=>unknown)
const toNumber = (v: unknown) => {
  // input[type=number]라도 RHF는 string을 줄 수 있음
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return v.trim() === '' ? NaN : Number(v);
  return NaN;
};

function createTaskInputSchema(
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  return z
    .object({
      title: z
        .string()
        .trim()
        .min(1, t('task.validation.titleRequired'))
        .max(80, t('task.validation.titleTooLong')),

      category: z.enum(CATEGORY_VALUES),

      // 여기서 output이 "number"로 확정됨
      durationMinutes: z.preprocess(
        toNumber,
        z
          .number()
          .int()
          .min(1, t('task.validation.durationMin'))
          .max(600, t('task.validation.durationTooLarge')),
      ),

      customDays: z.array(z.enum(DAY_VALUES)).optional(),
    })
    .superRefine((val, ctx) => {
      if (val.category === 'custom') {
        const days = val.customDays ?? [];
        if (days.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['customDays'],
            message: t('task.validation.pickOneDay'),
          });
        }
      }
    });
}

// (role: input type inferred from schema, type: type)
type CreateTaskSchema = ReturnType<typeof createTaskInputSchema>;
type CreateTaskFormValues = z.input<CreateTaskSchema>;
export type CreateTaskInput = z.output<CreateTaskSchema>;

export interface TaskFormProps {
  onCreate: (input: CreateTaskInput) => void; // (role: create handler, type: (CreateTaskInput)=>void)
}

export function TaskForm({ onCreate }: TaskFormProps) {
  const { t } = useContext(LocaleContext);
  const schema = useMemo(() => createTaskInputSchema(t), [t]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateTaskFormValues, unknown, CreateTaskInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: 'custom',
      durationMinutes: 30,
      customDays: [],
    },
    mode: 'onChange',
  });

  const category = watch('category');
  const customDays = watch('customDays') ?? [];

  const canSubmit = useMemo(() => {
    if (!isValid) return false;
    if (category === 'custom' && customDays.length === 0) return false;
    return true;
  }, [isValid, category, customDays.length]);

  const toggleDay = (d: DayOfWeek) => {
    const next = customDays.includes(d)
      ? customDays.filter((x) => x !== d)
      : [...customDays, d];

    setValue('customDays', next, { shouldValidate: true, shouldDirty: true });
  };

  const submit = handleSubmit((data) => {
    const payload: CreateTaskInput =
      data.category === 'custom' ? data : { ...data, customDays: undefined };

    onCreate(payload);

    reset({
      title: '',
      category: 'weekday',
      durationMinutes: 30,
      customDays: ['Mon'],
    });
  });

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-base font-semibold text-zinc-100">
          {t('task.createTask')}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          {t('task.createTaskHelp')}
        </p>
      </div>

      <form onSubmit={submit}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              {t('task.title')}
            </label>
            <input
              {...register('title')}
              placeholder={t('task.titlePlaceholder')}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-400"
            />
            {errors.title && (
              <div className="mt-1 text-xs text-amber-200">
                {errors.title.message}
              </div>
            )}
          </div>

          <div className="w-32">
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              {t('time.durationMin')}
            </label>
            <input
              type="number"
              min={1}
              max={600}
              // RHF 변환 옵션 제거: Zod에서만 변환/검증
              {...register('durationMinutes')}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-400"
            />
            {errors.durationMinutes && (
              <div className="mt-1 text-xs text-amber-200">
                {errors.durationMinutes.message}
              </div>
            )}
          </div>

          <div className="w-full md:w-56">
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              {t('task.schedule')}
            </label>
            <select
              {...register('category')}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-400">
              <option value="weekday">{t('task.addScheduleWeekday')}</option>
              <option value="weekend">{t('task.addScheduleWeekend')}</option>
              <option value="daily">{t('task.addScheduleDaily')}</option>
              <option value="custom">{t('task.addScheduleCustom')}</option>
            </select>
          </div>

          <div className="md:pt-6">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className={[
                'w-full rounded-xl px-4 py-2 text-sm font-medium transition md:w-auto',
                'border',
                canSubmit
                  ? 'border-zinc-200 bg-zinc-100 text-zinc-900 hover:bg-white'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-500',
                'disabled:cursor-not-allowed disabled:opacity-70',
              ].join(' ')}>
              {t('common.add')}
            </button>
          </div>
        </div>

        {category === 'custom' && (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
            <div className="mb-2 text-xs font-medium text-zinc-400">
              {t('task.pickDays')}
            </div>

            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((d) => {
                const checked = customDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={[
                      'rounded-full px-3 py-1.5 text-sm transition',
                      'border',
                      checked
                        ? 'border-zinc-200 bg-zinc-100 text-zinc-900'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-200 hover:bg-zinc-900/70',
                    ].join(' ')}
                    aria-pressed={checked}>
                    {t(`time.day.${d}`)}
                  </button>
                );
              })}
            </div>

            {errors.customDays && (
              <div className="mt-2 text-xs text-amber-200">
                {String(errors.customDays.message)}
              </div>
            )}

            <p className="mt-2 text-xs text-zinc-500">
              {t('task.customCheckableNote')}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
