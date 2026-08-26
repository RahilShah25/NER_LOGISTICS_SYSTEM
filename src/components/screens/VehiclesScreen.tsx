import React, { useState } from 'react';
import {
  Truck,
  Search,
  Filter,
  MapPin,
  Clock,
  Phone,
  User,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Radio,
  Sliders,
  Thermometer,
  Zap,
  Gauge,
  Fuel,
  Cpu,
  Lock,
  MessageSquare
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export const VehiclesScreen: React.FC = () => {
  const {
    shipments,
    setSelectedShipmentId,
    setCurrentScreen,
    isLiveStreaming,
    setIsLiveStreaming,
    telemetryTicks,
    showToast
  } = useLogistics();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'moving' | 'delayed' | 'rerouted'>('all');
  const [selectedVehicleForConsole, setSelectedVehicleForConsole] = useState<string | null>('NER-MED-102');

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const activeVehicleObj = shipments.find(s => s.id === selectedVehicleForConsole) || shipments[0];

  // Dynamic Telemetry Metrics
  const liveSpeed = activeVehicleObj?.status === 'REROUTED' ? 44 : 58 + (telemetryTicks % 7);
  const liveFuel = Math.max(12, 78 - Math.floor(telemetryTicks * 0.2));
  const liveColdChain = 3.6 + ((telemetryTicks % 4) * 0.1);
  const liveEngineTemp = 86 + (telemetryTicks % 5);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Fleetbase & ERPNext Telematics Platform</h1>
          </div>
          <p className="text-xs text-slate-300">
            Modular Fleet OS providing real-time driver mobile dispatching, cold-chain temperature telemetry, and remote vehicle controls.
          </p>
        </div>

        {/* Live Stream Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
              isLiveStreaming
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Activity className="w-4 h-4 animate-pulse text-emerald-400" />
            <span>{isLiveStreaming ? 'WEBSOCKET STREAM ACTIVE (60Hz)' : 'STREAM PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Fleet Telematics Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Vehicle Live Telemetry Gauges (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">SELECTED VEHICLE TELEMETRY</span>
                <h3 className="font-bold text-base text-white">{activeVehicleObj?.vehicle}</h3>
                <p className="text-xs text-slate-400">Cargo: {activeVehicleObj?.cargo}</p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                activeVehicleObj?.status === 'REROUTED' ? 'bg-purple-950 text-purple-300 border border-purple-600' : 'bg-blue-950 text-blue-300 border border-blue-600'
              }`}>
                ● {activeVehicleObj?.status}
              </span>
            </div>

            {/* Live Telemetry Sensor Gauges */}
            <div className="grid grid-cols-2 gap-3">
              
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                  <span>GPS Speed</span>
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl font-black text-white">{liveSpeed} <span className="text-xs font-normal text-slate-400">km/h</span></div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${(liveSpeed / 80) * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                  <span>Fuel Level</span>
                  <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-emerald-400">{liveFuel}%</div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${liveFuel}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                  <span>Cold-Chain Storage</span>
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xl font-black text-cyan-300">{liveColdChain.toFixed(1)}°C</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Optimal Range (2 - 8°C)</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                  <span>Engine Temp</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl font-black text-amber-400">{liveEngineTemp}°C</div>
                <div className="text-[10px] text-slate-400">Normal Range</div>
              </div>

            </div>

            {/* Driver Manifest Details */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
                <span>Driver & Trip Manifest</span>
                <span className="text-slate-400 font-mono text-[10px]">ERPNext Manifest ID #8841</span>
              </div>
              <div><strong className="text-white">Driver:</strong> {activeVehicleObj?.driverName}</div>
              <div><strong className="text-white">Hotline:</strong> {activeVehicleObj?.driverPhone}</div>
              <div><strong className="text-white">Assigned Corridor:</strong> {activeVehicleObj?.currentCorridor}</div>
              <div><strong className="text-white">ETA:</strong> {activeVehicleObj?.updatedEta}</div>
            </div>

            {/* Remote Intervention Buttons */}
            <div className="space-y-2 pt-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fleetbase Remote Dispatch Controls</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => showToast('info', 'Reroute Dispatch Sent', `Pushed turn-by-turn bypass instructions to driver ${activeVehicleObj?.driverName}.`)}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Push Dispatch</span>
                </button>
                <button
                  onClick={() => showToast('warning', 'Governor Lock Active', `Set 50 km/h speed governor for ${activeVehicleObj?.vehicle}.`)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Governor</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Fleet Inventory & Tracking Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by driver, vehicle..."
                className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['all', 'moving', 'rerouted', 'delayed'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table View */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Vehicle & Cargo</th>
                    <th className="py-3.5 px-4">Driver</th>
                    <th className="py-3.5 px-4">Route</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Console</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredShipments.map(s => {
                    const isSelected = selectedVehicleForConsole === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedVehicleForConsole(s.id)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-950/40 border-l-4 border-l-indigo-500' : 'hover:bg-slate-800/40'}`}
                      >
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-purple-400">{s.vehicle}</div>
                          <div className="text-[10px] text-slate-400">{s.cargo}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{s.driverName}</div>
                          <div className="text-[10px] text-slate-400">{s.driverPhone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          {s.origin} → {s.destination}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            s.status === 'REROUTED' ? 'bg-purple-950 text-purple-300 border border-purple-600' :
                            s.status === 'DELAYED' ? 'bg-amber-950 text-amber-300 border border-amber-600' : 'bg-blue-950 text-blue-300 border border-blue-600'
                          }`}>
                            ● {s.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedShipmentId(s.id);
                              setCurrentScreen('map');
                            }}
                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                          >
                            Live Map
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
