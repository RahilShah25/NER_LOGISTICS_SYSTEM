import React, { useState } from 'react';
import {
  ArrowLeft,
  GitFork,
  OctagonX,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  MapPin,
  FileText,
  User,
  Radio,
  Truck,
  Compass,
  ArrowRight,
  ShieldAlert,
  Gauge
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../common/StatusBadge';
import { EscalateModal } from '../modals/EscalateModal';

export const RoadDetailScreen: React.FC = () => {
  const {
    roads,
    shipments,
    incidents,
    selectedRoadId,
    setSelectedRoadId,
    setSelectedShipmentId,
    setCurrentScreen,
    updateRoadStatus,
    showToast
  } = useLogistics();

  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);

  // Find road or fallback to DIM-KOH-01
  const road = roads.find(r => r.id === (selectedRoadId || 'DIM-KOH-01')) || roads[0];

  // Find affected shipments
  const affectedShipments = shipments.filter(
    s => s.originalRoute.includes(road.id) || s.activeRoute.includes(road.id)
  );

  // Road incidents
  const roadIncidents = incidents.filter(i => i.roadCode === road.id);

  const handleStatusChange = (newStatus: 'OPEN' | 'RESTRICTED' | 'BLOCKED') => {
    updateRoadStatus(
      road.id,
      newStatus,
      `Manual status transition to ${newStatus} from Corridor Operations Control Room.`
    );
  };

  const handleUseAlternateRoute = () => {
    setCurrentScreen('route-planner');
    showToast('info', 'Routing Engine Loaded', 'Calculating cargo-aware bypass for corridor.');
  };

  return (
    <div className="space-y-5">
      
      {/* Top Back Navigation & Road Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('roads')}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
            title="Back to Roads & Corridors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-base font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {road.id}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {road.name}
              </h1>
              <StatusBadge status={road.status} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {road.state} • Length: {road.lengthKm} km • Standard Transit: {road.normalTravelTimeMins} mins
            </p>
          </div>
        </div>

        {/* Operational Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleStatusChange('OPEN')}
            className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
              road.status === 'OPEN'
                ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>OPEN ROAD</span>
          </button>

          <button
            onClick={() => handleStatusChange('RESTRICTED')}
            className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
              road.status === 'RESTRICTED'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>RESTRICT ROAD</span>
          </button>

          <button
            onClick={() => handleStatusChange('BLOCKED')}
            className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
              road.status === 'BLOCKED'
                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400 animate-pulse'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300'
            }`}
          >
            <OctagonX className="w-3.5 h-3.5" />
            <span>BLOCK ROAD</span>
          </button>

          <button
            onClick={() => setIsEscalateModalOpen(true)}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ESCALATE</span>
          </button>
        </div>
      </div>

      {/* 3-COLUMN RISK & METADATA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Large Risk Indicator Gauge (4 Cols) */}
        <div className="lg:col-span-4 gov-card p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                COMPOSITE RISK INDEX
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                Weights: 45/35/20
              </span>
            </div>

            {/* Large Score Card */}
            <div className="my-4 text-center p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div
                className={`text-5xl font-black tracking-tight ${
                  road.riskScore >= 80
                    ? 'text-rose-600'
                    : road.riskScore >= 60
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {road.riskScore}
                <span className="text-xl text-slate-400 font-bold">/100</span>
              </div>
              <span
                className={`inline-block mt-2 font-black text-xs uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  road.riskScore >= 80
                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                    : road.riskScore >= 60
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}
              >
                {road.riskScore >= 80 ? 'CRITICAL DISRUPTION RISK' : road.riskScore >= 60 ? 'ELEVATED RISK' : 'LOW RISK'}
              </span>
            </div>

            {/* Risk Factor Breakdown Bars */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Rainfall Saturation:</span>
                  <span className="font-mono font-bold text-slate-900">{road.rainfallScore} / 45</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(road.rainfallScore / 45) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Historical Landslide Frequency:</span>
                  <span className="font-mono font-bold text-slate-900">{road.historicalScore} / 35</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(road.historicalScore / 35) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Terrain Gradient Vulnerability:</span>
                  <span className="font-mono font-bold text-slate-900">{road.terrainScore} / 20</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(road.terrainScore / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-100 text-[11px] text-slate-600 border border-slate-200 mt-2">
            <span className="font-bold block text-slate-800">Dynamic Risk Rule:</span>
            Scores above 70 apply automatic penalty multipliers in the route optimizer to divert medical shipments.
          </div>
        </div>

        {/* Corridor Telemetry & Timeline (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Metadata Grid */}
          <div className="gov-card p-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
              Corridor Operational Metadata
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Current Status</span>
                <span className="font-bold text-slate-900">{road.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Last Updated</span>
                <span className="font-mono font-bold text-slate-900">{road.lastUpdated}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Reporting Source</span>
                <span className="font-semibold text-slate-900 line-clamp-1">{road.source}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Filed By</span>
                <span className="font-semibold text-slate-900 line-clamp-1">{road.reporter}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-700 block mb-1">Operational Field Advisory:</span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {road.notes}
              </p>
            </div>
          </div>

          {/* Incident Timeline */}
          <div className="gov-card p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Incident & Hazard Timeline
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
              {[
                { time: '14:28 IST', title: 'Landslide Blockage Confirmed', desc: 'Massive boulder & mudslide buried 45m carriageway at Paglapahar KM 42. Road closed.', type: 'critical' },
                { time: '14:25 IST', title: 'Field Worker Report Submitted', desc: 'Mobile incident report filed with geo-coordinates and high-resolution damage photo.', type: 'warning' },
                { time: '14:10 IST', title: 'Rainfall Saturation Exceeded 40mm', desc: 'IoT weather telemetry station triggered high pore-pressure alert on rock slope.', type: 'warning' },
                { time: '13:45 IST', title: 'Risk Index Elevated to High', desc: 'Automated decision layer raised corridor risk from 28 to 74.', type: 'info' },
              ].map((ev, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      ev.type === 'critical' ? 'bg-rose-600 ring-2 ring-rose-200' : ev.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                  ></div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-500">{ev.time}</span>
                    <span className="font-bold text-slate-900">{ev.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{ev.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* AFFECTED SHIPMENTS & ALTERNATE ROUTES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Affected Shipments (6 Cols) */}
        <div className="lg:col-span-6 gov-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Affected Essential Shipments</h3>
              <p className="text-[11px] text-slate-500">Live active cargo traversing this corridor</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-xs">
              {affectedShipments.length} Detected
            </span>
          </div>

          <div className="space-y-2.5">
            {affectedShipments.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">
                No active shipments currently on this corridor.
              </div>
            ) : (
              affectedShipments.map(s => (
                <div
                  key={s.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700">{s.id}</span>
                        <span className="font-bold text-slate-800 text-xs">{s.cargo}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {s.origin} → {s.destination} ({s.vehicle})
                      </div>
                    </div>
                    <StatusBadge status={s.status} size="sm" />
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Updated ETA:</span>
                      <span className="font-bold text-slate-800 block">{s.updatedEta}</span>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => {
                          setSelectedShipmentId(s.id);
                          setCurrentScreen('shipment-detail');
                        }}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                      >
                        View Shipment
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alternate Routes Comparison (6 Cols) */}
        <div className="lg:col-span-6 gov-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Automated Alternate Corridors</h3>
              <p className="text-[11px] text-slate-500">Evaluated options for disruption diversion</p>
            </div>
            <button
              onClick={handleUseAlternateRoute}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Route Planner →
            </button>
          </div>

          <div className="space-y-3">
            {/* Route A - Primary (BLOCKED) */}
            <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Route A: Primary Direct Highway</span>
                <StatusBadge status={road.status} size="sm" />
              </div>
              <div className="font-mono text-xs text-slate-600">
                Dimapur → Kohima (NH-29)
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-rose-200/60">
                <span>Distance: 74 km</span>
                <span>ETA: 1h 50m</span>
                <span className="text-rose-600 font-bold">Impasse (Debris)</span>
              </div>
            </div>

            {/* Route B - Wokha Bypass (OPEN) */}
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">Route B: Designated Wokha Bypass</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
                    RECOMMENDED
                  </span>
                </div>
                <StatusBadge status="OPEN" size="sm" />
              </div>

              <div className="font-mono text-xs font-bold text-blue-800">
                Dimapur → Wokha → Kohima (DIM-WOK-00 + KOH-WOK-02)
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-emerald-200/60">
                <span>Distance: 145 km</span>
                <span>ETA: 2h 35m (+25m)</span>
                <span className="text-emerald-700 font-bold">Risk: 24/100 (Low)</span>
              </div>

              <button
                onClick={handleUseAlternateRoute}
                className="w-full mt-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Use Alternate Route (Wokha Bypass)</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <EscalateModal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        incidentId="INC-0091"
      />

    </div>
  );
};
