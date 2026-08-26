import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertOctagon,
  MapPin,
  Clock,
  User,
  ShieldAlert,
  CheckCircle,
  TrendingUp,
  Image as ImageIcon,
  Truck,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../common/StatusBadge';
import { EscalateModal } from '../modals/EscalateModal';

export const IncidentDetailScreen: React.FC = () => {
  const {
    incidents,
    selectedIncidentId,
    setCurrentScreen,
    setSelectedRoadId,
    setSelectedShipmentId,
    acknowledgeIncident,
    resolveIncident,
    updateRoadStatus,
    shipments
  } = useLogistics();

  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);

  const incident = incidents.find(i => i.id === (selectedIncidentId || 'INC-0091')) || incidents[0];

  const affectedShipmentsList = shipments.filter(s =>
    incident.affectedShipmentIds?.includes(s.id) || s.originalRoute.includes(incident.roadCode)
  );

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('incidents')}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
            title="Back to Incidents"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-base font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {incident.id}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {incident.type} Hazard Report
              </h1>
              <StatusBadge status={incident.severity} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Corridor: <strong className="text-slate-700">{incident.roadCode}</strong> • {incident.district}, {incident.state} • Filed at {incident.createdTime}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {incident.status === 'Unresolved' && (
            <button
              onClick={() => acknowledgeIncident(incident.id)}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Acknowledge</span>
            </button>
          )}

          {incident.status !== 'Resolved' && (
            <button
              onClick={() => resolveIncident(incident.id)}
              className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark Resolved & Open Road</span>
            </button>
          )}

          <button
            onClick={() => setIsEscalateModalOpen(true)}
            className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Escalate to State</span>
          </button>
        </div>
      </div>

      {/* AI RECOMMENDATION BANNER (CORE DECISION LAYER VALUE) */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4 rounded-xl border border-blue-800 shadow-md flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-600/40 border border-blue-400 text-blue-300 flex-shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5 text-blue-300 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
              LOGISTICS DECISION ENGINE RECOMMENDATION:
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-600 text-emerald-300">
              High Confidence
            </span>
          </div>
          <p className="text-sm font-extrabold text-white mt-1">
            "{incident.recommendedAction}"
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <button
              onClick={() => {
                updateRoadStatus(incident.roadCode, 'BLOCKED');
                setCurrentScreen('route-planner');
              }}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
            >
              Execute Decision & Reroute Manifest →
            </button>
            <span className="text-slate-400 text-[11px]">
              Protects critical medical vaccines from temperature deterioration
            </span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN INCIDENT DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Metadata & Photo (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Metadata Card */}
          <div className="gov-card p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Incident Evidence & Geo-Location
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Hazard Type</span>
                <span className="font-bold text-slate-900">{incident.type}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">GPS Coordinates</span>
                <span className="font-mono font-bold text-blue-600">{incident.coordinates}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Corridor Code</span>
                <span
                  onClick={() => {
                    setSelectedRoadId(incident.roadCode);
                    setCurrentScreen('road-detail');
                  }}
                  className="font-mono font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  {incident.roadCode} →
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Reported By</span>
                <span className="font-semibold text-slate-800">{incident.reporter}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Designation</span>
                <span className="text-slate-600">{incident.reporterRole}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Current Status</span>
                <span className="font-bold text-slate-900">{incident.status}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-800 text-xs block mb-1">Field Description:</span>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                {incident.description}
              </p>
            </div>
          </div>

          {/* Incident Photo Attachment */}
          <div className="gov-card p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Field Inspection Photo Attachment
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Verified Field Camera Upload</span>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900 max-h-72">
              <img
                src={incident.photoUrl || "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80"}
                alt="Landslide blockage visual evidence"
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950/90 to-transparent text-white text-xs">
                <div className="font-bold">Chainage KM 42+300, Paglapahar (NH-29)</div>
                <div className="text-[11px] text-slate-300 font-mono">Timestamp: 14:25 IST • Lat: 25.8642°N Lon: 93.7511°E</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Affected Shipments & Incident Timeline (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Affected Shipments */}
          <div className="gov-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Impacted Active Shipments ({affectedShipmentsList.length})
              </h3>
            </div>

            <div className="space-y-2">
              {affectedShipmentsList.map(s => (
                <div
                  key={s.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-700">{s.id}</span>
                    <StatusBadge status={s.status} size="sm" />
                  </div>
                  <div className="font-bold text-slate-800">{s.cargo}</div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>{s.origin} → {s.destination}</span>
                    <span className="font-bold text-rose-600">ETA: {s.updatedEta}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedShipmentId(s.id);
                      setCurrentScreen('shipment-detail');
                    }}
                    className="w-full mt-1 py-1 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-[11px] transition-colors"
                  >
                    Track Shipment Telemetry →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Stage Incident Timeline */}
          <div className="gov-card p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Incident Response Stages
            </h3>

            <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
              {incident.timeline?.map((ev, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-1 ring-blue-300"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ev.stage}</span>
                    <span className="font-mono text-[10px] text-slate-400">{ev.time}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 block">{ev.actor}</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">{ev.note}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <EscalateModal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        incidentId={incident.id}
      />

    </div>
  );
};
