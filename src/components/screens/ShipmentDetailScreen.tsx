import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  Phone,
  RotateCcw,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Compass,
  MessageSquare,
  Navigation,
  Sparkles
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../common/StatusBadge';
import { NortheastIndiaMap } from '../map/NortheastIndiaMap';

export const ShipmentDetailScreen: React.FC = () => {
  const {
    shipments,
    selectedShipmentId,
    setCurrentScreen,
    setSelectedRoadId,
    showToast
  } = useLogistics();

  const shipment = shipments.find(s => s.id === (selectedShipmentId || 'NER-MED-102')) || shipments[0];

  const handleContactDriver = () => {
    showToast('info', 'Driver Comm Terminal', `Dispatch instruction SMS relayed to driver ${shipment.driverName} (${shipment.driverPhone}).`);
  };

  const handleMarkCheckpoint = () => {
    showToast('success', 'Checkpoint Logged', `Checkpoint confirmation registered for ${shipment.id} at Wokha Bypass KM 38.`);
  };

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('shipments')}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
            title="Back to Shipments"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-base font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {shipment.id}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {shipment.cargo}
              </h1>
              <StatusBadge status={shipment.status} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {shipment.origin} → {shipment.destination} • Vehicle: <strong className="text-slate-700">{shipment.vehicle}</strong> • Driver: {shipment.driverName}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleContactDriver}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span>Contact Driver</span>
          </button>

          <button
            onClick={handleMarkCheckpoint}
            className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Mark Checkpoint</span>
          </button>

          <button
            onClick={() => setCurrentScreen('route-planner')}
            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Re-Optimize Route</span>
          </button>
        </div>
      </div>

      {/* ETA DELTA & REROUTE REASON BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ETA Telemetry Card (4 Cols) */}
        <div className="lg:col-span-4 gov-card p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
            ETA & Delay Analysis
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Original ETA</span>
              <span className="text-xl font-black text-slate-700 font-mono">{shipment.originalEta}</span>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Updated ETA</span>
              <span className="text-xl font-black text-blue-900 font-mono">{shipment.updatedEta}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-900">Total Transit Variance:</span>
            </div>
            <span className="font-black text-xs text-amber-900 font-mono">
              +{shipment.delayMinutes} mins (Controlled Bypass)
            </span>
          </div>

          {shipment.rerouteReason && (
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
              <span className="font-bold block text-purple-900">Reroute Trigger:</span>
              <p className="text-[11px] leading-relaxed text-purple-900">
                {shipment.rerouteReason}
              </p>
            </div>
          )}
        </div>

        {/* Live Route Telemetry & Driver Manifest (8 Cols) */}
        <div className="lg:col-span-8 gov-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Assigned Corridor Path & Manifest
            </h3>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Telemetry Active (GPS 10s Pings)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Commodity</span>
              <span className="font-bold text-slate-900">{shipment.cargoType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Priority Level</span>
              <span className="font-bold text-rose-600">{shipment.priority}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Vehicle ID</span>
              <span className="font-mono font-bold text-slate-900">{shipment.vehicle}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Driver Comm</span>
              <span className="font-mono text-slate-700 font-semibold">{shipment.driverPhone}</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Active Path Segments:
            </span>
            <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
              {shipment.activeRoute.map((roadId, i) => (
                <React.Fragment key={roadId}>
                  <span
                    onClick={() => {
                      setSelectedRoadId(roadId);
                      setCurrentScreen('road-detail');
                    }}
                    className="px-2.5 py-1 rounded bg-blue-50 border border-blue-300 text-blue-800 font-bold hover:bg-blue-100 cursor-pointer"
                  >
                    {roadId}
                  </span>
                  {i < shipment.activeRoute.length - 1 && (
                    <span className="text-slate-400 font-black">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* LIVE MAP & EVENT TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Live Route Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-slate-800 text-sm">Live Route Telemetry</span>
            <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Purple Marker: Vehicle on Wokha Bypass
            </span>
          </div>
          <NortheastIndiaMap
            selectedShipmentHighlight={shipment.id}
            heightClass="h-[380px] lg:h-[440px]"
          />
        </div>

        {/* Chronological Event Timeline (5 Cols) */}
        <div className="lg:col-span-5 gov-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Live Mission Timeline
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Chronological Audit Log</span>
          </div>

          <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs max-h-[350px] overflow-y-auto pr-1">
            {shipment.timeline.map((ev, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    ev.type === 'alert'
                      ? 'bg-rose-600 ring-2 ring-rose-200'
                      : ev.type === 'warning'
                      ? 'bg-amber-500'
                      : ev.type === 'success'
                      ? 'bg-emerald-500'
                      : 'bg-blue-600'
                  }`}
                ></div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-500">{ev.time}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 rounded ${
                      ev.type === 'alert'
                        ? 'bg-rose-100 text-rose-800'
                        : ev.type === 'success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ev.type || 'info'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-semibold mt-1 leading-snug">
                  {ev.event}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
