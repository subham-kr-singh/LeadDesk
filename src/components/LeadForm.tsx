'use client';

import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, LeadFormData } from '@/lib/validations';
import { createLeadAction } from '@/app/actions/leadActions';
import { Loader2, Check } from 'lucide-react';

const BUDGET_OPTIONS = [
  { label: 'Under $5,000', hint: 'Discovery or small scope', value: '< $5,000' },
  { label: '$5,000 – $15,000', hint: 'Typical agency sprint', value: '$5,000 - $15,000' },
  { label: '$15,000 – $50,000', hint: 'Multi-phase build', value: '$15,000 - $50,000' },
  { label: '$50,000+', hint: 'Retainer or large program', value: '$50,000+' },
] as const;

const MIN_MESSAGE = 10;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}

export default function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      budgetRange: '',
      message: '',
    },
  });

  const name = useWatch({ control, name: 'name' }) ?? '';
  const email = useWatch({ control, name: 'email' }) ?? '';
  const budgetValue = useWatch({ control, name: 'budgetRange' }) ?? '';
  const messageValue = useWatch({ control, name: 'message' }) ?? '';

  const progress = useMemo(() => {
    let steps = 0;
    if (name.trim().length >= 2 && email.includes('@')) steps += 1;
    if (budgetValue) steps += 1;
    if (messageValue.trim().length >= MIN_MESSAGE) steps += 1;
    return steps;
  }, [name, email, budgetValue, messageValue]);

  const messageRemaining = Math.max(0, MIN_MESSAGE - messageValue.trim().length);

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await createLeadAction(data);

      if (!response.success) {
        if (response.fieldErrors) {
          Object.entries(response.fieldErrors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              setError(field as keyof LeadFormData, {
                type: 'server',
                message: messages[0],
              });
            }
          });
        }
        setServerError(response.error || 'Please fix the highlighted fields and try again.');
        setIsSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      reset();
    } catch (err) {
      console.error('Lead submission exception:', err);
      setServerError('We could not send your inquiry. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    [
      'w-full rounded-xl px-4 py-3 text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400',
      'bg-zinc-100/80 border border-transparent',
      'transition-[background-color,box-shadow,border-color]',
      'focus:bg-white focus:border-zinc-300 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/15',
      hasError ? 'border-red-400 bg-red-50/50 focus:ring-red-500/20' : '',
    ].join(' ');

  if (submitSuccess) {
    return (
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 sm:p-10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]">
            <Check className="h-7 w-7" strokeWidth={2.25} aria-hidden />
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-zinc-900">You&apos;re on the list</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            We saved your inquiry and will email you at the address you provided. Most replies go out within one
            business day.
          </p>
          <button
            type="button"
            onClick={() => setSubmitSuccess(false)}
            className="mt-8 text-sm font-medium text-[#2563EB] hover:text-blue-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 rounded-sm"
          >
            Submit another project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] overflow-hidden">
      <div className="border-b border-zinc-100 bg-zinc-50/80 px-5 sm:px-7 py-4">
        <div className="flex items-center justify-between gap-4 mb-3">
          <p className="text-sm font-medium text-zinc-800">Start your inquiry</p>
          <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
            {progress}/3 ready
          </span>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
                i < progress ? 'bg-[#2563EB]' : 'bg-zinc-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {serverError && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
          <fieldset className="space-y-4 border-0 p-0 m-0">
            <legend className="text-xs font-semibold text-zinc-500 mb-1">Who should we reply to?</legend>

            <div>
              <label htmlFor="name" className="sr-only">
                Your name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                aria-invalid={!!errors.name}
                {...register('name')}
                className={inputClass(!!errors.name)}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="Work email"
                aria-invalid={!!errors.email}
                {...register('email')}
                className={inputClass(!!errors.email)}
              />
              <FieldError message={errors.email?.message} />
            </div>
          </fieldset>

          <fieldset className="space-y-3 border-0 p-0 m-0">
            <legend className="text-xs font-semibold text-zinc-500 mb-1">Estimated budget</legend>
            <input type="hidden" {...register('budgetRange')} />
            <div className="space-y-2" role="radiogroup" aria-label="Estimated budget">
              {BUDGET_OPTIONS.map((opt) => {
                const selected = budgetValue === opt.value;
                const id = `budget-${opt.value.replace(/\s+/g, '-')}`;
                return (
                  <label
                    key={opt.value}
                    htmlFor={id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors motion-reduce:transition-none ${
                      selected
                        ? 'border-[#2563EB] bg-[#2563EB]/[0.06] shadow-[inset_0_0_0_1px_rgba(37,99,235,0.25)]'
                        : 'border-zinc-200/90 bg-zinc-50/50 hover:border-zinc-300 hover:bg-zinc-50'
                    } ${errors.budgetRange && !selected ? 'border-red-200' : ''}`}
                  >
                    <input
                      id={id}
                      type="radio"
                      name="budgetRangeChoice"
                      value={opt.value}
                      checked={selected}
                      onChange={() =>
                        setValue('budgetRange', opt.value, { shouldValidate: true, shouldDirty: true })
                      }
                      className="mt-1 h-4 w-4 shrink-0 border-zinc-300 text-[#2563EB] focus:ring-[#2563EB] focus:ring-offset-0"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-zinc-900">{opt.label}</span>
                      <span className="block text-xs text-zinc-500 mt-0.5">{opt.hint}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <FieldError message={errors.budgetRange?.message} />
          </fieldset>

          <fieldset className="space-y-2 border-0 p-0 m-0">
            <div className="flex items-baseline justify-between gap-2">
              <legend className="text-xs font-semibold text-zinc-500">What are you building?</legend>
              <span
                className={`font-mono text-[11px] tabular-nums ${
                  messageRemaining > 0 ? 'text-zinc-400' : 'text-emerald-600'
                }`}
              >
                {messageRemaining > 0 ? `${messageRemaining} more chars` : 'Looks good'}
              </span>
            </div>
            <label htmlFor="message" className="sr-only">
              Project message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Share goals, timeline, and anything that helps us respond with useful next steps…"
              aria-invalid={!!errors.message}
              {...register('message')}
              className={`${inputClass(!!errors.message)} min-h-[140px] resize-y leading-relaxed`}
            />
            <FieldError message={errors.message?.message} />
          </fieldset>

          <div className="pt-2 border-t border-zinc-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 active:bg-blue-700 disabled:opacity-55 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />
                  Sending…
                </>
              ) : (
                'Send inquiry'
              )}
            </button>
            <p className="mt-3 text-center text-xs text-zinc-500">
              No spam — just a direct reply from our team.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
