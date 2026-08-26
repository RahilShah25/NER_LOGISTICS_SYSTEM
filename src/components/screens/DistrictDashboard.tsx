import React, { useState } from 'react';
import {
  GitFork,
  AlertTriangle,
  OctagonX,
  Zap,
  Truck,
  BellRing,
  RotateCcw,
  Eye,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle,
  Clock,
  Radio
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import { NortheastIndiaMap } from '../map/NortheastIndiaMap';
import { BlockRoadModal } from '../modals/BlockRoadModal';
import { EscalateModal } from '../modals/EscalateModal';
import { CreateShipmentModal } from '../modals/CreateShipmentModal';

export const DistrictDashboard: React.FC = () => {
  const {
    roads,
    shipments,
    alerts,
    activeDistrict,
    setCurrentScreen,
    setSelectedRoadId,
    setSelectedShipmentId,
    setSelectedIncidentId,
    acknowledgeAlert,
    escalateAlert,
    t
  } = useLogistics();

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);

  // Dynamic KPI calculations
  const openCount = roads.filter(r => r.status === 'OPEN').length;
  const restrictedCount = roads.filter(r => r.status === 'RESTRICTED').length;
  const blockedCount = roads.filter(r => r.status === 'BLOCKED').length;
  const highRiskCount = roads.filter(r => r.riskScore >= 70 || r.status === 'HIGH_RISK').length;
  const activeShipmentsCount = shipments.filter(s => s.status !== 'DELIVERED').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical' && !a.isResolved).length;

  const unresolvedAlerts = alerts.filter(a => !a.isResolved).slice(0, 3);

  // Top Bottlenecks sorted by risk
  const topBottlenecks = [...roads]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  return (
    <div className="space-y-5">
      
      {/* Top Header & Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {activeDistrict} District Operations
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              Active Command
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time logistics accessibility and disruption monitoring • Last updated 14:32 IST
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCreateShipmentOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Dispatch Cargo</span>
          </button>

          <button
            onClick={() => setIsBlockModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <OctagonX className="w-3.5 h-3.5" />
            <span>Update Road Status</span>
          </button>
        </div>
      </div>

      {/* 6 KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          label="OPEN CORRIDORS"
          value={openCount}
          subtext="+2 operational today"
          icon={<GitFork className="w-4 h-4" />}
          variant="green"
          onClick={() => setCurrentScreen('roads')}
        />
        <KpiCard
          label="RESTRICTED"
          value={restrictedCount}
          subtext="Requires speed limit / escort"
          icon={<AlertTriangle className="w-4 h-4" />}
          variant="amber"
          onClick={() => setCurrentScreen('roads')}
        />
        <KpiCard
          label="BLOCKED"
          value={blockedCount}
          subtext={blockedCount > 0 ? "Critical blockage active" : "Zero blockages reported"}
          icon={<OctagonX className="w-4 h-4" />}
          variant="red"
          onClick={() => setCurrentScreen('roads')}
        />
        <KpiCard
          label="HIGH-RISK CORRIDORS"
          value={highRiskCount}
          subtext="Precipitation elevated"
          icon={<Zap className="w-4 h-4" />}
          variant="orange"
          onClick={() => setCurrentScreen('roads')}
        />
        <KpiCard
          label="ACTIVE SHIPMENTS"
          value={activeShipmentsCount}
          subtext="6 essential medical/food"
          icon={<Truck className="w-4 h-4" />}
          variant="blue"
          onClick={() => setCurrentScreen('shipments')}
        />
        <KpiCard
          label="CRITICAL ALERTS"
          value={criticalAlertsCount}
          subtext={`${alerts.filter(a => !a.isResolved).length} total unresolved`}
          icon={<BellRing className="w-4 h-4" />}
          variant="red"
          onClick={() => setCurrentScreen('alerts')}
        />
      </div>

      {/* MAIN MAP & CRITICAL ALERT PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Large Map (8 Cols on Desktop) */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">Real-time Corridor Geo-Topology</span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">• Click road or shipment node for telemetry</span>
            </div>
            <button
              onClick={() => setCurrentScreen('roads')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <span>View All Corridors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <NortheastIndiaMap heightClass="h-[400px] lg:h-[480px]" />
        </div>

        {/* Critical Alert Panel (4 Cols on Desktop) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">Critical Disruption Alerts</span>
              {criticalAlertsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] animate-pulse">
                  {criticalAlertsCount} ACTION REQ
                </span>
              )}
            </div>
            <button
              onClick={() => setCurrentScreen('alerts')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Triage Center
            </button>
          </div>

          {/* Alert Cards Container */}
          <div className="space-y-3 flex-1">
            {unresolvedAlerts.length === 0 ? (
              <div className="gov-card p-6 text-center text-slate-500 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <span className="font-bold block text-slate-700 text-sm">All Corridors Clear</span>
                No active critical disruptions or blockage alerts.
              </div>
            ) : (
              unresolvedAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`gov-card p-4 border-l-4 transition-all shadow-sm ${
                    alert.severity === 'Critical'
                      ? 'border-l-rose-600 bg-rose-50/40'
                      : 'border-l-amber-500 bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={alert.severity} size="sm" />
                      <span className="font-mono text-xs text-slate-500 font-bold">{alert.roadCode}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{alert.createdTime}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs mt-2">
                    {alert.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    <strong className="text-slate-700">Cause:</strong> {alert.cause}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-600">
                      📦 {alert.affectedShipmentsCount} Affected Shipments
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        disabled={alert.isAcknowledged}
                        className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-semibold disabled:opacity-50"
                      >
                        {alert.isAcknowledged ? 'Ack ✓' : 'Acknowledge'}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedRoadId(alert.roadCode);
                          setCurrentScreen('road-detail');
                        }}
                        className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          setIsEscalateModalOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold"
                      >
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* TOP BOTTLENECKS & SHIPMENT STATUS 2-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Top Bottlenecks Table (5 Cols) */}
        <div className="lg:col-span-5 gov-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Top Bottlenecks</h3>
              <p className="text-[11px] text-slate-500">Highest composite risk corridors</p>
            </div>
            <button
              onClick={() => setCurrentScreen('route-planner')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Route Optimizer
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase">
                  <th className="py-2 text-left">Rank</th>
                  <th className="py-2 text-left">Corridor</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Risk</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topBottlenecks.map((road, idx) => (
                  <tr key={road.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-2.5">
                      <span className="font-bold text-slate-900 block">{road.name.split('(')[0]}</span>
                      <span className="font-mono text-[10px] text-slate-500">{road.id}</span>
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={road.status} size="sm" />
                    </td>
                    <td className="py-2.5 font-bold text-slate-800">
                      <span className={road.riskScore >= 80 ? 'text-rose-600' : road.riskScore >= 60 ? 'text-amber-600' : 'text-slate-700'}>
                        {road.riskScore}/100
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      {road.status === 'BLOCKED' ? (
                        <button
                          onClick={() => {
                            setCurrentScreen('route-planner');
                          }}
                          className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-sm"
                        >
                          Reroute
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedRoadId(road.id);
                            setCurrentScreen('road-detail');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                        >
                          Monitor
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipment Status Table (7 Cols) */}
        <div className="lg:col-span-7 gov-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Essential Shipment Operations</h3>
              <p className="text-[11px] text-slate-500">Live manifest & automated rerouting status</p>
            </div>
            <button
              onClick={() => setCurrentScreen('shipments')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              All Shipments ({shipments.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase">
                  <th className="py-2 text-left">Shipment ID</th>
                  <th className="py-2 text-left">Cargo</th>
                  <th className="py-2 text-left">Corridor</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">ETA</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.slice(0, 4).map(shipment => (
                  <tr key={shipment.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5">
                      <span className="font-mono font-bold text-blue-600 block">{shipment.id}</span>
                      <span className="text-[10px] text-slate-400">{shipment.vehicle.split('(')[0]}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="font-bold text-slate-800 block line-clamp-1">{shipment.cargo}</span>
                      <span className="text-[10px] text-slate-500">{shipment.cargoType}</span>
                    </td>
                    <td className="py-2.5 font-medium text-slate-700">
                      {shipment.origin} → {shipment.destination}
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={shipment.status} size="sm" />
                    </td>
                    <td className="py-2.5">
                      <span className="font-bold text-slate-900 block">{shipment.updatedEta}</span>
                      {shipment.delayMinutes > 0 ? (
                        <span className="text-[10px] text-rose-600 font-bold">+{shipment.delayMinutes}m delay</span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold">On Schedule</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedShipmentId(shipment.id);
                          setCurrentScreen('shipment-detail');
                        }}
                        className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-[11px]"
                      >
                        {shipment.status === 'REROUTED' ? 'View Bypass' : 'Track'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modals */}
      <BlockRoadModal isOpen={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)} />
      <EscalateModal isOpen={isEscalateModalOpen} onClose={() => setIsEscalateModalOpen(false)} />
      <CreateShipmentModal isOpen={isCreateShipmentOpen} onClose={() => setIsCreateShipmentOpen(false)} />

    </div>
  );
};
