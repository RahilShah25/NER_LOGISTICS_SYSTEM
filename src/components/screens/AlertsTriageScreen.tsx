import React, { useState } from 'react';
import {
  BellRing,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  TrendingUp,
  Search,
  Filter,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../common/StatusBadge';
import { KpiCard } from '../common/KpiCard';
import { EscalateModal } from '../modals/EscalateModal';

export const AlertsTriageScreen: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    escalateAlert,
    setSelectedRoadId,
    setCurrentScreen
  } = useLogistics();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [targetIncidentForEscalate, setTargetIncidentForEscalate] = useState('INC-0091');

  const criticalCount = alerts.filter(a => a.severity === 'Critical' && !a.isResolved).length;
  const warningCount = alerts.filter(a => a.severity === 'Warning' && !a.isResolved).length;
  const infoCount = alerts.filter(a => a.severity === 'Info').length;
  const unresolvedCount = alerts.filter(a => !a.isResolved).length;

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Alerts & Incident Triage Center
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
              {unresolvedCount} Active Disruptions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time hazard triage, multi-agency escalation and operational acknowledgment workflow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Severity Levels</option>
            <option value="Critical">Critical Only</option>
            <option value="Warning">Warning Only</option>
            <option value="Info">Info Only</option>
          </select>
        </div>
      </div>

      {/* 4 TOP KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          label="CRITICAL DISRUPTIONS"
          value={criticalCount}
          subtext="Immediate road blockage"
          icon={<ShieldAlert className="w-4 h-4" />}
          variant="red"
        />
        <KpiCard
          label="WARNING HAZARDS"
          value={warningCount}
          subtext="Rainfall / single lane"
          icon={<AlertTriangle className="w-4 h-4" />}
          variant="amber"
        />
        <KpiCard
          label="INFORMATIONAL"
          value={infoCount}
          subtext="Routine maintenance"
          icon={<Info className="w-4 h-4" />}
          variant="blue"
        />
        <KpiCard
          label="UNRESOLVED TOTAL"
          value={unresolvedCount}
          subtext="Pending action"
          icon={<BellRing className="w-4 h-4" />}
          variant="orange"
        />
      </div>

      {/* ALERTS CARDS & TRIAGE LIST */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`gov-card p-4 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 ${
              alert.isResolved
                ? 'border-l-emerald-500 bg-slate-50/60 opacity-80'
                : alert.severity === 'Critical'
                ? 'border-l-rose-600 bg-rose-50/40 shadow-rose-100'
                : alert.severity === 'Warning'
                ? 'border-l-amber-500 bg-amber-50/30'
                : 'border-l-blue-500 bg-blue-50/20'
            }`}
          >
            {/* Alert Description */}
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={alert.severity} size="sm" />
                <span className="font-mono font-bold text-xs text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {alert.roadCode}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {alert.createdTime}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Escalation: {alert.escalationLevel}
                </span>
                {alert.isResolved && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    RESOLVED ✓
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm mt-1">
                {alert.title}
              </h3>

              <p className="text-xs text-slate-600">
                <strong className="text-slate-700">Root Cause:</strong> {alert.cause} •{' '}
                <span className="font-semibold text-slate-800">📦 {alert.affectedShipmentsCount} Affected Shipments</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap flex-shrink-0 w-full md:w-auto justify-end">
              {!alert.isResolved && (
                <>
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    disabled={alert.isAcknowledged}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    {alert.isAcknowledged ? 'Acknowledged ✓' : 'Acknowledge'}
                  </button>

                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() => {
                      setTargetIncidentForEscalate('INC-0091');
                      setIsEscalateModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                  >
                    Escalate
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setSelectedRoadId(alert.roadCode);
                  setCurrentScreen('road-detail');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                View Corridor
              </button>
            </div>
          </div>
        ))}
      </div>

      <EscalateModal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        incidentId={targetIncidentForEscalate}
      />

    </div>
  );
};
