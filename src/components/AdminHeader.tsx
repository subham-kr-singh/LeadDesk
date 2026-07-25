'use client';

import { signOut } from 'next-auth/react';
import { LogOut, ShieldCheck, User } from 'lucide-react';

interface AdminHeaderProps {
  userEmail?: string | null;
}

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  return (
    <header className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              LeadDesk <span className="text-indigo-400">Admin</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Lead Operations & Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {userEmail && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-200">{userEmail}</span>
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-semibold transition-all active:scale-[0.98]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
