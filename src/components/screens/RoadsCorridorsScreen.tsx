import React, { useState } from 'react';
import {
  GitFork,
  Search,
  Filter,
  Plus,
  Download,
  OctagonX,
  AlertTriangle,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../common/StatusBadge';
import { BlockRoadModal } from '../modals/BlockRoadModal';
import { RoadStatus } from '../../types';

export const RoadsCorridorsScreen: React.FC = () => {
  const { roads, setSelectedRoadId, setCurrentScreen, showToast } = useLogistics();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const filteredRoads = roads.filter(road => {
    const matchesSearch =
      road.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      road.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      road.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      road.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || road.status === statusFilter;
    const matchesState = stateFilter === 'ALL' || road.state.includes(stateFilter);
    const matchesRisk =
      riskFilter === 'ALL' ||
      (riskFilter === 'HIGH' && road.riskScore >= 70) ||
      (riskFilter === 'MEDIUM' && road.riskScore >= 40 && road.riskScore < 70) ||
      (riskFilter === 'LOW' && road.riskScore < 40);

    return matchesSearch && matchesStatus && matchesState && matchesRisk;
  });

  const handleExportCSV = () => {
    const headers = ['Road Code', 'Corridor Name', 'State', 'Status', 'Risk Score', 'Rainfall Level', 'Length KM', 'Last Updated'];
    const rows = filteredRoads.map(r => [
      r.id,
      `"${r.name}"`,
      `"${r.state}"`,
      r.status,
      r.riskScore,
      r.rainfallLevel,
      r.lengthKm,
      r.lastUpdated
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NER_Corridor_Accessibility_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('success', 'Manifest Exported', 'Corridor accessibility data exported to CSV.');
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Road & Corridor Accessibility
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {roads.length} Corridors Monitored
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational status, real-time risk scores, rainfall telemetry and blockage management
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsBlockModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <OctagonX className="w-3.5 h-3.5" />
            <span>Update Status</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="gov-card p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search road code or corridor (e.g. DIM-KOH)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-between md:justify-end">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN (Accessible)</option>
            <option value="RESTRICTED">RESTRICTED (Caution)</option>
            <option value="BLOCKED">BLOCKED (Closed)</option>
            <option value="HIGH_RISK">HIGH RISK</option>
          </select>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All States</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Assam">Assam</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Arunachal">Arunachal Pradesh</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Tripura">Tripura</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Risk Scores</option>
            <option value="HIGH">High Risk (70-100)</option>
            <option value="MEDIUM">Medium Risk (40-69)</option>
            <option value="LOW">Low Risk (0-39)</option>
          </select>
        </div>
      </div>

      {/* Corridor Table */}
      <div className="gov-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                <th className="py-3 px-4 text-left">Road Code</th>
                <th className="py-3 px-4 text-left">Corridor Name</th>
                <th className="py-3 px-4 text-left">State / District</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Risk Score</th>
                <th className="py-3 px-4 text-left">Rainfall</th>
                <th className="py-3 px-4 text-left">Incidents</th>
                <th className="py-3 px-4 text-left">Last Updated</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No corridors match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRoads.map(road => (
                  <tr
                    key={road.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      road.status === 'BLOCKED' ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {road.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{road.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {road.lengthKm} km • ~{road.normalTravelTimeMins} mins
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-semibold block">{road.state}</span>
                      <span className="text-[11px] text-slate-400">{road.district}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={road.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono font-bold ${
                            road.riskScore >= 80
                              ? 'text-rose-600 font-black'
                              : road.riskScore >= 60
                              ? 'text-amber-600 font-bold'
                              : 'text-emerald-700'
                          }`}
                        >
                          {road.riskScore}
                        </span>
                        <span className="text-[10px] text-slate-400">/100</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span
                        className={`font-semibold ${
                          road.rainfallLevel === 'Severe'
                            ? 'text-rose-600 font-bold'
                            : road.rainfallLevel === 'High'
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {road.rainfallLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">
                      {road.incidentsCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                          {road.incidentsCount} Active
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {road.lastUpdated}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRoadId(road.id);
                          setCurrentScreen('road-detail');
                        }}
                        className="px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs transition-colors"
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BlockRoadModal isOpen={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)} />
    </div>
  );
};
