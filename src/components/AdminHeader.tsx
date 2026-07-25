'use client';

import { signOut } from 'next-auth/react';

interface AdminHeaderProps {
  userEmail?: string | null;
}

function initialsFromEmail(email?: string | null) {
  if (!email) return '?';
  const local = email.split('@')[0] ?? '';
  return (local.slice(0, 2) || '?').toUpperCase();
}

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold tracking-tight text-zinc-950 truncate">
            LeadDesk Mini
          </span>
          <span className="hidden sm:inline font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {userEmail && (
            <div className="hidden sm:flex items-center gap-2.5 pl-1">
              <span
                className="w-8 h-8 rounded-full bg-zinc-100 ring-1 ring-zinc-200/80 flex items-center justify-center font-mono text-xs font-medium text-zinc-600"
                aria-hidden
              >
                {initialsFromEmail(userEmail)}
              </span>
              <span className="text-xs text-zinc-600 max-w-[180px] truncate">{userEmail}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-950 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
