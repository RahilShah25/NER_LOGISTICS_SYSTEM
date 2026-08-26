import React from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Server,
  Database,
  Satellite,
  CloudLightning,
  Radio,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { INITIAL_INTEGRATIONS } from '../../data/initialData';

export const IntegrationsScreen: React.FC = () => {
  const systemHealth = [
    { module: 'Core REST & GraphQL APIs', status: 'Operational', latency: '42ms', uptime: '99.98%' },
    { module: 'PostgreSQL GeoSpatial Database', status: 'Operational', latency: '12ms', uptime: '100%' },
    { module: 'GPS Vehicle Telematics Gateway', status: 'Operational', latency: '95ms', uptime: '99.95%' },
    { module: 'IMD & Weather Radar Service', status: 'Operational', latency: '142ms', uptime: '99.90%' },
    { module: 'ISRO NESAC Satellite GIS Feed', status: 'Operational', latency: '280ms', uptime: '99.85%' },
    { module: 'NER-LINK AI Inference Engine', status: 'Operational', latency: '180ms', uptime: '99.92%' },
    { module: 'Cellular SMS & IVR Broadcast Gateway', status: 'Operational', latency: '110ms', uptime: '100%' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">System Integrations & Health Center</h1>
          </div>
          <p className="text-xs text-slate-300">
            Real-time API connector statuses, data sync health, and infrastructure component metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-mono font-bold text-emerald-400">ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>

      {/* System Health Component Status Grid */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Core Infrastructure Health Monitors</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemHealth.map((sh, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-white">{sh.module}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">Latency: {sh.latency} • Uptime: {sh.uptime}</div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{sh.status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* External Integration Connectors Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>External Data Connectors & Gateways</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_INTEGRATIONS.map(intg => (
            <div
              key={intg.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">{intg.id} • {intg.category}</span>
                    <h4 className="font-bold text-sm text-white">{intg.name}</h4>
                    <div className="text-xs text-slate-400">Provider: {intg.provider}</div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    intg.status === 'Connected' ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-amber-950 text-amber-300 border border-amber-600'
                  }`}>
                    ● {intg.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Sync Latency</div>
                    <div className="font-bold text-white">{intg.latencyMs} ms</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Health Score</div>
                    <div className="font-bold text-emerald-400">{intg.healthScore}%</div>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Last Telemetry Sync: </span>
                  {intg.lastSync}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors">
                  Test Connection
                </button>
                <button className="text-xs font-bold text-blue-400 hover:text-blue-300">
                  Configure Settings &rarr;
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
