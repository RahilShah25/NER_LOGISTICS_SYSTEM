import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  Eye,
  Plus,
  OctagonX,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../common/StatusBadge';
import { IncidentType, IncidentSeverity } from '../../types';

export const IncidentsScreen: React.FC = () => {
  const { incidents, setSelectedIncidentId, setCurrentScreen } = useLogistics();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.roadCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || inc.type === typeFilter;
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Incident Management & Hazard Logs
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
              {incidents.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time logs of landslides, flood washouts, bridge structural alerts and weather hazards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('field-report')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>File New Incident</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="gov-card p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search incident ID, road code, or description..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-between md:justify-end">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Hazard Types</option>
            <option value="Landslide">Landslide</option>
            <option value="Flood">Flood</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Bridge Damage">Bridge Damage</option>
            <option value="Heavy Rainfall">Heavy Rainfall</option>
            <option value="Connectivity Loss">Connectivity Loss</option>
          </select>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Warning">Warning</option>
            <option value="Info">Info</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Unresolved">Unresolved</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Resolved">Resolved</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="gov-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                <th className="py-3 px-4 text-left">Incident ID</th>
                <th className="py-3 px-4 text-left">Hazard Type</th>
                <th className="py-3 px-4 text-left">Corridor / Location</th>
                <th className="py-3 px-4 text-left">Severity</th>
                <th className="py-3 px-4 text-left">Reporter</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Created Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No incident reports match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map(inc => (
                  <tr
                    key={inc.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      inc.severity === 'Critical' ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-rose-600">
                      {inc.id}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {inc.type}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-700 block">{inc.roadCode}</span>
                      <span className="text-[11px] text-slate-500">{inc.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inc.severity} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-semibold block">{inc.reporter}</span>
                      <span className="text-[11px] text-slate-400">{inc.reporterRole}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold text-[11px] px-2 py-0.5 rounded-full border ${
                          inc.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : inc.status === 'Escalated'
                            ? 'bg-purple-50 text-purple-800 border-purple-200 font-bold'
                            : inc.status === 'Acknowledged'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                        }`}
                      >
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {inc.createdTime}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedIncidentId(inc.id);
                          setCurrentScreen('incident-detail');
                        }}
                        className="px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs transition-colors"
                      >
                        View & Triage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
