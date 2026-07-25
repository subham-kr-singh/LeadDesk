'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, LeadFormData } from '@/lib/validations';
import { createLeadAction } from '@/app/actions/leadActions';
import { User, Mail, DollarSign, MessageSquare, CheckCircle2, AlertTriangle, Send, Loader2 } from 'lucide-react';

export default function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      budgetRange: '',
      message: '',
    },
  });

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
        setServerError(response.error || 'Validation failed.');
        setIsSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      reset();
    } catch (err) {
      console.error('Lead submission exception:', err);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Lead Received!</h3>
        <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed mb-8">
          Thank you for reaching out. Our team has received your information and will review your project requirements promptly.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-all border border-slate-700 hover:border-slate-600 shadow-md"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      {/* Decorative ambient background blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500"></div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white tracking-tight">Let's talk about your project</h3>
        <p className="text-sm text-slate-400 mt-1">Fill out the quick form below and we'll get back to you within 24 hours.</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Your Name <span className="text-indigo-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                id="name"
                type="text"
                placeholder="Sarah Jenkins"
                {...register('name')}
                className={`block w-full pl-10 pr-4 py-3 bg-slate-950/70 border ${
                  errors.name ? 'border-rose-500/60 focus:ring-rose-500/40' : 'border-slate-800 focus:ring-indigo-500/40 focus:border-indigo-500'
                } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 text-sm transition-all`}
              />
            </div>
            {errors.name && <p className="mt-1.5 text-xs text-rose-400">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address <span className="text-indigo-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="sarah@company.com"
                {...register('email')}
                className={`block w-full pl-10 pr-4 py-3 bg-slate-950/70 border ${
                  errors.email ? 'border-rose-500/60 focus:ring-rose-500/40' : 'border-slate-800 focus:ring-indigo-500/40 focus:border-indigo-500'
                } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 text-sm transition-all`}
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email.message}</p>}
          </div>
        </div>

        {/* Budget Range Dropdown */}
        <div>
          <label htmlFor="budgetRange" className="block text-sm font-medium text-slate-300 mb-2">
            Estimated Budget Range <span className="text-indigo-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <DollarSign className="h-4 w-4" />
            </div>
            <select
              id="budgetRange"
              {...register('budgetRange')}
              className={`block w-full pl-10 pr-10 py-3 bg-slate-950/70 border ${
                errors.budgetRange ? 'border-rose-500/60 focus:ring-rose-500/40' : 'border-slate-800 focus:ring-indigo-500/40 focus:border-indigo-500'
              } rounded-xl text-slate-100 focus:outline-none focus:ring-2 text-sm transition-all appearance-none cursor-pointer`}
            >
              <option value="" disabled className="bg-slate-900 text-slate-400">
                Select your budget...
              </option>
              <option value="< $5,000" className="bg-slate-900 text-slate-100">
                Less than $5,000
              </option>
              <option value="$5,000 - $15,000" className="bg-slate-900 text-slate-100">
                $5,000 - $15,000
              </option>
              <option value="$15,000 - $50,000" className="bg-slate-900 text-slate-100">
                $15,000 - $50,000
              </option>
              <option value="$50,000+" className="bg-slate-900 text-slate-100">
                $50,000+
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          {errors.budgetRange && <p className="mt-1.5 text-xs text-rose-400">{errors.budgetRange.message}</p>}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
            Project Overview & Goals <span className="text-indigo-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-500">
              <MessageSquare className="h-4 w-4" />
            </div>
            <textarea
              id="message"
              rows={4}
              placeholder="Tell us about your product goals, timeline, and key requirements..."
              {...register('message')}
              className={`block w-full pl-10 pr-4 py-3 bg-slate-950/70 border ${
                errors.message ? 'border-rose-500/60 focus:ring-rose-500/40' : 'border-slate-800 focus:ring-indigo-500/40 focus:border-indigo-500'
              } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 text-sm transition-all resize-y`}
            ></textarea>
          </div>
          {errors.message && <p className="mt-1.5 text-xs text-rose-400">{errors.message.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-xl shadow-indigo-600/20 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Request...</span>
            </>
          ) : (
            <>
              <span>Send Project Brief</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
