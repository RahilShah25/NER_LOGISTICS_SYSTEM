import React, { useState } from 'react';
import {
  Truck,
  Search,
  Filter,
  Plus,
  Eye,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../common/StatusBadge';
import { CreateShipmentModal } from '../modals/CreateShipmentModal';
import { CargoType, ShipmentStatus } from '../../types';

export const ShipmentsScreen: React.FC = () => {
  const { shipments, setSelectedShipmentId, setCurrentScreen } = useLogistics();

  const [searchQuery, setSearchQuery] = useState('');
  const [cargoFilter, setCargoFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredShipments = shipments.filter(s => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCargo = cargoFilter === 'ALL' || s.cargoType === cargoFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || s.priority === priorityFilter;

    return matchesSearch && matchesCargo && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Essential Shipment Operations
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              {shipments.length} Active Convoys
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry, automated rerouting bypasses, and cold-chain integrity monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Shipment</span>
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
            placeholder="Search shipment ID, cargo, or destination..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-between md:justify-end">
          <select
            value={cargoFilter}
            onChange={e => setCargoFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Cargo Types</option>
            <option value="Medicine">Medicine & Vaccines</option>
            <option value="Perishable Food">Perishable Food</option>
            <option value="Agricultural Produce">Agricultural Produce</option>
            <option value="Construction Material">Construction Material</option>
            <option value="Liquid Oxygen">Liquid Oxygen</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN TRANSIT">In Transit</option>
            <option value="REROUTED">Rerouted</option>
            <option value="DELAYED">Delayed</option>
            <option value="DELIVERED">Delivered</option>
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="Emergency">Emergency</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="gov-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                <th className="py-3 px-4 text-left">Shipment ID</th>
                <th className="py-3 px-4 text-left">Cargo Classification</th>
                <th className="py-3 px-4 text-left">Origin → Destination</th>
                <th className="py-3 px-4 text-left">Vehicle / Driver</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">ETA & Delay</th>
                <th className="py-3 px-4 text-left">Risk</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShipments.map(s => (
                <tr
                  key={s.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    s.status === 'REROUTED' ? 'bg-purple-50/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    <div className="flex items-center gap-1.5">
                      <span>{s.id}</span>
                      {s.priority === 'Emergency' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{s.cargo}</span>
                    <span className="text-[11px] text-slate-500">{s.cargoType}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <span className="font-mono block text-[11px] font-bold text-slate-900">{s.vehicle.split('(')[0]}</span>
                    <span className="text-[11px] text-slate-500">{s.driverName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={s.status} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{s.updatedEta}</span>
                    {s.delayMinutes > 0 ? (
                      <span className="text-[10px] text-rose-600 font-bold">+{s.delayMinutes} min delay</span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold">On Time</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold text-[11px] ${
                        s.riskLevel === 'High' || s.riskLevel === 'Critical'
                          ? 'text-rose-600 font-bold'
                          : s.riskLevel === 'Medium'
                          ? 'text-amber-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {s.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedShipmentId(s.id);
                        setCurrentScreen('shipment-detail');
                      }}
                      className="px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs transition-colors"
                    >
                      {s.status === 'REROUTED' ? 'View Bypass' : 'Track'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateShipmentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};
