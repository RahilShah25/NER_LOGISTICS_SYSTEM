import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldAlert,
  ArrowDown,
  Clock,
  User,
  CheckCircle,
  Building2,
  PhoneCall,
  Radio,
  FileText,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../common/StatusBadge';

export const EscalationCenterScreen: React.FC = () => {
  const { incidents, acknowledgeIncident, resolveIncident, setCurrentScreen, setSelectedRoadId, showToast } = useLogistics();

  // Simulated live SLA countdown timer
  const [seconds, setSeconds] = useState(261); // 04:21

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNDRFDispatch = () => {
    showToast('success', 'State NDRF Unit Dispatched', '12th Bn NDRF Doimukh deployed 2 JCB excavators and debris clearing battalion to Paglapahar.');
  };

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Multi-Tier Escalation Center
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
              Protocol: Field → District → State
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hierarchical command resolution for severe infrastructure blockages and multi-agency deployments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold">
            <Clock className="w-4 h-4 text-rose-600 animate-spin" />
            <span>State SLA Review: <strong>{formatTimer(seconds)}</strong></span>
          </div>
        </div>
      </div>

      {/* VERTICAL ESCALATION FLOW VISUALIZER */}
      <div className="gov-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              CASE: DIM-KOH-01 BLOCKAGE
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              Paglapahar KM 42 Landslide & Medical Freight Diversion
            </h2>
          </div>
          <StatusBadge status="BLOCKED" size="md" />
        </div>

        {/* 3-Tier Step Ladder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          
          {/* TIER 1: FIELD WORKER */}
          <div className="p-4 rounded-xl border-2 border-slate-300 bg-slate-50 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                1. FIELD WORKER
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                COMPLETED ✓
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              Reported Landslide
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• Reporter: <strong>K. Angami (FO-NAG-44)</strong></div>
              <div>• Time: <strong>14:25 IST</strong></div>
              <div>• Media: Photo & GPS Coordinates Logged</div>
            </div>
          </div>

          {/* TIER 2: DISTRICT OFFICER */}
          <div className="p-4 rounded-xl border-2 border-blue-400 bg-blue-50/50 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-blue-900 uppercase tracking-wider">
                2. DISTRICT OFFICER
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                ESCALATED ↗
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              Acknowledged & Escalated
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <div>• Officer: <strong>Dimapur District EOC Desk</strong></div>
              <div>• Acknowledged: <strong>14:28 IST</strong></div>
              <div>• Escalated: <strong>14:31 IST (Exceeds local PWD)</strong></div>
            </div>
          </div>

          {/* TIER 3: STATE COMMAND */}
          <div className="p-4 rounded-xl border-2 border-rose-500 bg-rose-50/60 space-y-2 relative shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-rose-900 uppercase tracking-wider">
                3. STATE COMMAND
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                PENDING REVIEW
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              Regional Action & Inter-Agency
            </div>
            <div className="text-xs text-slate-800 space-y-1">
              <div>• Target: <strong>Northeast Regional Command</strong></div>
              <div>• Escalation Pending: <strong>{formatTimer(seconds)}</strong></div>
              <div>• Action: NDRF & BRO Heavy Excavator Dispatch</div>
            </div>
          </div>

        </div>

        {/* State Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>State command review automatically notifies Chief Secretary & Disaster Management Directorate</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNDRFDispatch}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Deploy State NDRF Heavy Machinery</span>
            </button>

            <button
              onClick={() => {
                resolveIncident('INC-0091');
                setCurrentScreen('dashboard');
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
            >
              Resolve Case
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
