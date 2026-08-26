import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  Radio,
  Hospital,
  Warehouse,
  Truck,
  Navigation,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Activity
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { NortheastIndiaMap } from '../map/NortheastIndiaMap';

export const EmergencyCommandScreen: React.FC = () => {
  const { setCurrentScreen, roads, shipments, incidents } = useLogistics();

  const [emergOrigin, setEmergOrigin] = useState('Dimapur Medical Hub');
  const [emergDest, setEmergDest] = useState('Kohima Relief Shelter');
  const [vehicleType, setVehicleType] = useState('Cryogenic Oxygen Tanker');
  const [isGenerated, setIsGenerated] = useState(false);

  const activeEmergencies = [
    {
      id: 'EMG-01',
      title: 'Paglapahar Major Landslide Blockade',
      district: 'Dimapur / Kohima',
      state: 'Nagaland',
      severity: 'Critical',
      time: '14:28 IST',
      impact: 'Corridor DIM-KOH-01 Blocked. 3 Essential Shipments Disrupted.',
      reliefShelters: 4,
      hospitalsNeeded: 2
    },
    {
      id: 'EMG-02',
      title: 'Barak River Overflow Pre-Alert',
      district: 'Cachar',
      state: 'Assam',
      severity: 'Warning',
      time: '13:10 IST',
      impact: 'Culvert drainage stress on SIL-IMP-04. Single lane active.',
      reliefShelters: 2,
      hospitalsNeeded: 1
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border border-rose-600/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/40">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Emergency Response Command Center</h1>
          </div>
          <p className="text-xs text-rose-200/90">
            Real-time disaster mobilization, NDRF asset deployment, hospital oxygen tracking, and green-channel routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg animate-pulse">
            <PhoneCall className="w-4 h-4" />
            <span>NDRF Hotline (1078)</span>
          </button>
        </div>
      </div>

      {/* Emergency Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Map Dominance & Emergency Assets (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Map Box */}
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2 text-rose-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                EMERGENCY DISPATCH GIS LAYER
              </span>
              <span>GRID ACTIVE</span>
            </div>
            <NortheastIndiaMap heightClass="h-[420px] lg:h-[480px]" />
          </div>

          {/* Active Disaster Cards */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Active Emergency Declarations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeEmergencies.map(emg => (
                <div key={emg.id} className="p-4 rounded-xl bg-slate-900 border border-rose-900/60 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-rose-400">{emg.id} • {emg.time}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700">
                      {emg.severity}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{emg.title}</h4>
                  <div className="text-xs text-slate-400">{emg.state} ({emg.district})</div>
                  <p className="text-xs text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800">{emg.impact}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Emergency Route Dispatch Generator (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span>Emergency Route Generator</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Emergency Dispatch Origin</label>
                <input
                  type="text"
                  value={emergOrigin}
                  onChange={e => setEmergOrigin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Disaster Destination</label>
                <input
                  type="text"
                  value={emergDest}
                  onChange={e => setEmergDest(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Emergency Vehicle Category</label>
                <select
                  value={vehicleType}
                  onChange={e => setVehicleType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Cryogenic Oxygen Tanker">Cryogenic Oxygen Tanker</option>
                  <option value="NDRF Heavy Earthmover">NDRF Heavy Earthmover</option>
                  <option value="Refrigerated Vaccine Freight">Refrigerated Vaccine Freight</option>
                  <option value="High-Clearance Rescue 4x4">High-Clearance Rescue 4x4</option>
                </select>
              </div>

              <button
                onClick={() => setIsGenerated(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Generate Priority Emergency Route</span>
              </button>
            </div>

            {/* Generated Result Box */}
            {isGenerated && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-xs text-emerald-200 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    AI Emergency Route Ready
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">96% Safe</span>
                </div>

                <div className="space-y-1 text-slate-300">
                  <div><strong className="text-white">Route:</strong> Dimapur → Wokha Bypass → Kohima</div>
                  <div><strong className="text-white">ETA:</strong> 2h 15m (Green Corridor Escort)</div>
                  <div><strong className="text-white">Risk Score:</strong> 12 / 100</div>
                  <div><strong className="text-white">AI Note:</strong> Avoids Paglapahar landslide zone completely. Police escort unit #NAG-04 assigned.</div>
                </div>

                <button
                  onClick={() => setCurrentScreen('route-planner')}
                  className="w-full mt-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Dispatch Vehicle Now
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
