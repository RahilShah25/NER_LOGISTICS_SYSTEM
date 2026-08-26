import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../../data/initialData';

export const AuditLogsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLogs = INITIAL_AUDIT_LOGS.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Security & Governance Audit Trail</h1>
          </div>
          <p className="text-xs text-slate-300">
            Immutable log ledger tracking route rerouting decisions, incident escalations, and operator authentication events.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-300">
          SECURE AUDIT LEDGER v1.0
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search log by user, action, corridor..."
            className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['all', 'Created', 'Updated', 'Approved', 'Rejected', 'Rerouted'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All Actions' : st}
            </button>
          ))}
        </div>

      </div>

      {/* Desktop Audit Table / Mobile Card Reflow */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Desktop Table View (Hidden on mobile < 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Log ID & Time</th>
                <th className="py-3.5 px-4">User & Role</th>
                <th className="py-3.5 px-4">Action Performed</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Target Location</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-blue-400">{log.id}</div>
                    <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{log.user}</div>
                    <div className="text-[10px] text-slate-400">{log.role}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {log.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      log.status === 'Rerouted' ? 'bg-purple-950 text-purple-300 border border-purple-600' :
                      log.status === 'Created' ? 'bg-blue-950 text-blue-300 border border-blue-600' : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Card View (< 768px) */}
        <div className="md:hidden p-4 space-y-3">
          {filteredLogs.map(log => (
            <div key={log.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="font-mono font-bold text-blue-400">{log.id}</span>
                  <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-600">
                  {log.status}
                </span>
              </div>

              <div>
                <strong className="text-white">Action: </strong>
                <span className="text-slate-200">{log.action}</span>
              </div>

              <div>
                <strong className="text-white">User: </strong>
                <span className="text-slate-300">{log.user} ({log.role})</span>
              </div>

              <div className="text-[11px] text-slate-400">
                Location: {log.location} • Module: {log.module}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
