'use client';

import { useState, useTransition } from 'react';
import { Lead } from '@/db/schema';
import { updateLeadStatusAction } from '@/app/actions/leadActions';
import { Search, ChevronDown, ChevronUp, Calendar, Mail, DollarSign, CheckCircle2, Clock, XCircle, Filter, Sparkles, Inbox } from 'lucide-react';

interface LeadsTableProps {
  initialLeads: Lead[];
}

export default function LeadsTable({ initialLeads }: LeadsTableProps) {
  const [leadsList, setLeadsList] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedLeadIds, setExpandedLeadIds] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  // Handle optimistic status change
  const handleStatusChange = (leadId: string, newStatus: 'new' | 'contacted' | 'closed') => {
    // Optimistic UI update
    setLeadsList((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
    );

    // Call server action in transition
    startTransition(async () => {
      const res = await updateLeadStatusAction(leadId, newStatus);
      if (!res.success) {
        // Revert on failure
        setLeadsList(initialLeads);
        alert(res.error || 'Failed to update status.');
      }
    });
  };

  // Toggle message expand
  const toggleExpand = (id: string) => {
    setExpandedLeadIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter leads based on search query and status filter
  const filteredLeads = leadsList.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalCount = leadsList.length;
  const newCount = leadsList.filter((l) => l.status === 'new').length;
  const contactedCount = leadsList.filter((l) => l.status === 'contacted').length;
  const closedCount = leadsList.filter((l) => l.status === 'closed').length;

  return (
    <div className="space-y-6">
      {/* Metrics Summary Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Leads</span>
            <Inbox className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalCount}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-amber-400">New Leads</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{newCount}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-400">Contacted</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{contactedCount}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">Closed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{closedCount}</p>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-lg">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'contacted', 'closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-4 px-5">Lead Contact</th>
                <th className="py-4 px-5">Budget Range</th>
                <th className="py-4 px-5">Message Brief</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Submitted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-medium text-slate-400">No leads found</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Try adjusting your search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isExpanded = !!expandedLeadIds[lead.id];
                  const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Contact Info */}
                      <td className="py-4 px-5 align-top">
                        <div className="font-semibold text-slate-100 text-sm">{lead.name}</div>
                        <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                          <Mail className="w-3 h-3 shrink-0 text-slate-500" />
                          <span>{lead.email}</span>
                        </div>
                      </td>

                      {/* Budget Range */}
                      <td className="py-4 px-5 align-top whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-[11px]">
                          <DollarSign className="w-3 h-3 text-indigo-400" />
                          {lead.budgetRange}
                        </span>
                      </td>

                      {/* Message (Truncated with Expand) */}
                      <td className="py-4 px-5 align-top max-w-xs sm:max-w-md">
                        <p className={`text-slate-300 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
                          {lead.message}
                        </p>
                        {lead.message.length > 80 && (
                          <button
                            onClick={() => toggleExpand(lead.id)}
                            className="mt-1 inline-flex items-center gap-0.5 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium focus:outline-none"
                          >
                            {isExpanded ? (
                              <>
                                <span>Show less</span>
                                <ChevronUp className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                <span>Read full message</span>
                                <ChevronDown className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        )}
                      </td>

                      {/* Status Selector Dropdown */}
                      <td className="py-4 px-5 align-top whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value as 'new' | 'contacted' | 'closed')
                          }
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 transition-all ${
                            lead.status === 'new'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 focus:ring-amber-500/50'
                              : lead.status === 'contacted'
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 focus:ring-blue-500/50'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 focus:ring-emerald-500/50'
                          }`}
                        >
                          <option value="new" className="bg-slate-900 text-amber-400">
                            ● New
                          </option>
                          <option value="contacted" className="bg-slate-900 text-blue-400">
                            ● Contacted
                          </option>
                          <option value="closed" className="bg-slate-900 text-emerald-400">
                            ● Closed
                          </option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 align-top whitespace-nowrap text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
