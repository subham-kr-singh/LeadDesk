import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { leads, Lead } from '@/db/schema';
import { desc } from 'drizzle-orm';
import AdminHeader from '@/components/AdminHeader';
import LeadsTable from '@/components/LeadsTable';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  let allLeads: Lead[] = [];
  try {
    allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
  } catch (error) {
    console.error('Failed to fetch leads:', error);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <AdminHeader userEmail={session.user.email} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Lead Management Overview
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review inbound client requests, update status pipelines, and filter leads.
          </p>
        </div>

        <LeadsTable initialLeads={allLeads} />
      </main>
    </div>
  );
}
