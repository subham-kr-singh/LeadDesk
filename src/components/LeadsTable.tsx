'use client';

import { useState, useTransition, useCallback } from 'react';
import { Lead } from '@/db/schema';
import { updateLeadStatusAction } from '@/app/actions/leadActions';
import { Search, Inbox, X } from 'lucide-react';

interface LeadsTableProps {
  initialLeads: Lead[];
}

type LeadStatus = 'new' | 'contacted' | 'closed';

function StatusBadge({ status }: { status: LeadStatus }) {
  if (status === 'new') {
    return (
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-blue-50/80 text-blue-700 ring-1 ring-blue-600/20 font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse motion-reduce:animate-none" />
        New
      </span>
    );
  }
  if (status === 'contacted') {
    return (
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-amber-50/80 text-amber-700 ring-1 ring-amber-600/20 font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
        Contacted
      </span>
    );
  }
  return (
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-zinc-100 text-zinc-600 ring-1 ring-zinc-300/50 font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 text-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
      Closed
    </span>
  );
}

function statusSelectClass(status: LeadStatus) {
  const base =
    'relative w-full min-w-[9.5rem] h-9 pl-[5.5rem] pr-8 rounded-lg border-0 bg-transparent text-[transparent] text-xs font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 appearance-none [&>option]:!text-zinc-900 [&>option]:!bg-white';
  if (status === 'new') return `${base} focus-visible:ring-blue-600/30`;
  if (status === 'contacted') return `${base} focus-visible:ring-amber-600/30`;
  return `${base} focus-visible:ring-zinc-400`;
}

export default function LeadsTable({ initialLeads }: LeadsTableProps) {
  const [leadsList, setLeadsList] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [messageLead, setMessageLead] = useState<Lead | null>(null);
  const [, startTransition] = useTransition();

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    const previous = leadsList;
    setLeadsList((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
    );

    startTransition(async () => {
      const res = await updateLeadStatusAction(leadId, newStatus);
      if (!res.success) {
        setLeadsList(previous);
        alert(res.error || 'Could not update status. Try again.');
      }
    });
  };

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
  }, []);

  const filteredLeads = leadsList.filter((lead) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(q) || lead.email.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = leadsList.length;
  const hasActiveFilters = searchQuery.length > 0 || statusFilter !== 'all';
  const isEmptyDatabase = totalCount === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Lead inflow</h2>
            <span className="font-mono text-xs font-medium text-zinc-600 bg-zinc-100 ring-1 ring-zinc-200/80 px-2.5 py-1 rounded-full">
              {totalCount} total
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">Search by name or email, then update follow-up status.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 p-4 bg-zinc-50/80 ring-1 ring-zinc-200/60 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" aria-hidden />
          <input
            type="search"
            placeholder="Search name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200/80 rounded-lg text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
            aria-label="Search leads by name or email"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'new', 'contacted', 'closed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 ${
                statusFilter === st
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white text-zinc-600 ring-1 ring-zinc-200/80 hover:bg-zinc-50'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      <div className="ring-1 ring-zinc-200/70 rounded-xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider border-b border-zinc-200/60 bg-zinc-50/50">
                <th className="py-3 px-4 min-w-[160px]">Lead</th>
                <th className="py-3 px-4 whitespace-nowrap">Budget</th>
                <th className="py-3 px-4 min-w-[200px]">Message</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 px-6">
                    <div className="max-w-sm mx-auto text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-xl ring-1 ring-zinc-200/80 flex items-center justify-center text-zinc-400">
                        <Inbox className="w-6 h-6" strokeWidth={1.25} aria-hidden />
                      </div>
                      <p className="font-medium text-zinc-900">
                        {isEmptyDatabase ? 'No leads yet' : 'No leads found'}
                      </p>
                      <p className="text-sm text-zinc-500 mt-1">
                        {isEmptyDatabase
                          ? 'New inquiries from the public form will appear here.'
                          : 'Try a different search or clear your filters.'}
                      </p>
                      {hasActiveFilters && !isEmptyDatabase && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-4 text-sm font-medium text-[#2563EB] hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 rounded-sm"
                        >
                          Reset search and filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const status = lead.status as LeadStatus;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-zinc-50/80 transition-colors"
                    >
                      <td className="py-4 px-4 align-top">
                        <div className="font-medium text-zinc-900">{lead.name}</div>
                        <div className="text-zinc-500 text-xs mt-0.5">{lead.email}</div>
                      </td>

                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <span className="font-mono text-xs font-medium text-zinc-700">
                          {lead.budgetRange}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top max-w-xs">
                        <button
                          type="button"
                          onClick={() => setMessageLead(lead)}
                          className="text-left w-full truncate max-w-xs text-zinc-600 hover:text-zinc-900 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 rounded-sm"
                        >
                          {lead.message}
                        </button>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="relative inline-flex items-center">
                          <StatusBadge status={status} />
                          <select
                            value={lead.status}
                            aria-label={`Status for ${lead.name}`}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as LeadStatus)
                            }
                            className={statusSelectClass(status)}
                          >
                            <option value="new" style={{ color: '#18181b', backgroundColor: '#fff' }}>New</option>
                            <option value="contacted" style={{ color: '#18181b', backgroundColor: '#fff' }}>Contacted</option>
                            <option value="closed" style={{ color: '#18181b', backgroundColor: '#fff' }}>Closed</option>
                          </select>
                          <svg
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <time
                          dateTime={new Date(lead.createdAt).toISOString()}
                          className="font-mono text-xs font-medium text-zinc-400"
                        >
                          {formattedDate}
                        </time>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {messageLead && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="message-drawer-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[2px]"
            aria-label="Close message"
            onClick={() => setMessageLead(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl ring-1 ring-zinc-200/80 shadow-xl shadow-zinc-950/10 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 id="message-drawer-title" className="text-lg font-bold tracking-tight text-zinc-900">
                  {messageLead.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">{messageLead.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setMessageLead(null)}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{messageLead.message}</p>
            <p className="mt-4 font-mono text-xs text-zinc-400">
              Budget: {messageLead.budgetRange}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
