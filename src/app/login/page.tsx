'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const inputBase =
  'block w-full px-3.5 py-2.5 bg-white border border-zinc-200/80 rounded-lg text-sm font-normal text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        setServerError('Invalid email or password. Check your credentials and try again.');
        setIsSubmitting(false);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setServerError('Sign-in failed unexpectedly. Wait a moment and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex w-10 h-10 rounded-lg bg-zinc-950 text-white text-sm font-bold items-center justify-center mb-4">
          L
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">LeadDesk Mini</h1>
        <p className="mt-2 text-sm text-zinc-500">Sign in to view and update leads.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl ring-1 ring-zinc-200/80 shadow-xl shadow-zinc-950/5">
          {serverError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-lg bg-red-50 ring-1 ring-red-200/80 text-red-700 text-sm font-medium"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@agency.com"
                {...register('email')}
                className={`${inputBase} ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('password')}
                className={`${inputBase} ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-[#2563EB] hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 rounded-sm"
            >
              ← Back to inquiry form
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
