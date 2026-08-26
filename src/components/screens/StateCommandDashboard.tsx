import React from 'react';
import {
  Building2,
  GitFork,
  OctagonX,
  AlertTriangle,
  Zap,
  Truck,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  Activity,
  Layers,
  PhoneCall
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { NE_STATES_DATA } from '../../data/initialData';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import { NortheastIndiaMap } from '../map/NortheastIndiaMap';

export const StateCommandDashboard: React.FC = () => {
  const { roads, shipments, incidents, alerts, setCurrentScreen, setSelectedRoadId } = useLogistics();

  const totalCorridors = roads.length;
  const blockedCorridors = roads.filter(r => r.status === 'BLOCKED').length;
  const restrictedCorridors = roads.filter(r => r.status === 'RESTRICTED').length;
  const highRiskCorridors = roads.filter(r => r.riskScore >= 70 || r.status === 'HIGH_RISK').length;
  const activeShipments = shipments.filter(s => s.status !== 'DELIVERED').length;
  const criticalEscalations = incidents.filter(i => i.status === 'Escalated' || i.severity === 'Critical').length;

  const escalationFeed = [
    {
      district: 'DIMAPUR (NAGALAND)',
      issue: 'Critical Road Blockage (DIM-KOH-01 Paglapahar Landslide)',
      severity: 'Critical',
      time: 'Escalated 14:31 IST',
      actionReq: 'NDRF Heavy Earthmover Deployment'
    },
    {
      district: 'KOHIMA (NAGALAND)',
      issue: 'Heavy Rainfall Slope Instability (KOH-TAM-05 Corridor)',
      severity: 'Warning',
      time: 'Escalated 14:15 IST',
      actionReq: 'Issue Preemptive Logistics Reroute'
    },
    {
      district: 'IMPHAL WEST (MANIPUR)',
      issue: 'Single-Lane Culvert Repair Delay (SIL-IMP-04)',
      severity: 'Warning',
      time: 'Escalated 13:40 IST',
      actionReq: 'State Police Convoy Escort'
    },
    {
      district: 'CACHAR (ASSAM)',
      issue: 'Flash Flood Silt Inundation near Badarpur Bridge',
      severity: 'Info',
      time: 'Escalated 13:10 IST',
      actionReq: 'PWD Clearance Team on Standby'
    }
  ];

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-600/30 border border-purple-500/50 text-purple-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Northeast Regional Logistics Command
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Aggregated accessibility and essential-goods movement across 7 Northeast States
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Regional Uptime: 92.4%</span>
          </div>
        </div>
      </div>

      {/* State-Level Aggregate KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          label="TOTAL CORRIDORS"
          value={totalCorridors}
          subtext="7 Inter-State Lifelines"
          icon={<GitFork className="w-4 h-4" />}
          variant="slate"
        />
        <KpiCard
          label="BLOCKED"
          value={blockedCorridors}
          subtext={blockedCorridors > 0 ? "Action required" : "Zero blockages"}
          icon={<OctagonX className="w-4 h-4" />}
          variant="red"
        />
        <KpiCard
          label="RESTRICTED"
          value={restrictedCorridors}
          subtext="Single-lane / Speed limit"
          icon={<AlertTriangle className="w-4 h-4" />}
          variant="amber"
        />
        <KpiCard
          label="HIGH RISK"
          value={highRiskCorridors}
          subtext="Rainfall / Terrain alert"
          icon={<Zap className="w-4 h-4" />}
          variant="orange"
        />
        <KpiCard
          label="ACTIVE SHIPMENTS"
          value={activeShipments}
          subtext="Inter-state freight"
          icon={<Truck className="w-4 h-4" />}
          variant="blue"
        />
        <KpiCard
          label="CRITICAL ESCALATIONS"
          value={criticalEscalations}
          subtext="State Command Review"
          icon={<ShieldAlert className="w-4 h-4" />}
          variant="purple"
        />
      </div>

      {/* REGIONAL MAP & ESCALATION FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-slate-800 text-sm">7-State Operational Transit Grid</span>
            <span className="text-xs text-slate-500 font-semibold">Assam • Nagaland • Manipur • Meghalaya • Mizoram • Tripura • Arunachal</span>
          </div>
          <NortheastIndiaMap heightClass="h-[420px] lg:h-[500px]" />
        </div>

        {/* District Escalation Feed (5 Cols) */}
        <div className="lg:col-span-5 gov-card p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">District Escalation Feed</h3>
                <p className="text-[11px] text-slate-500">Live priority requests from District EOCs</p>
              </div>
              <button
                onClick={() => setCurrentScreen('escalations')}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold"
              >
                Escalation Center
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2 space-y-2">
              {escalationFeed.map((item, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{item.district}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">{item.issue}</p>
                  
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-bold border border-rose-200">
                      Req: {item.actionReq}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRoadId('DIM-KOH-01');
                        setCurrentScreen('road-detail');
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      Intervene →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 mt-3">
            <span className="font-bold block mb-0.5">State Command Protocol:</span>
            State Logistics Officers can override district dispatch bans and authorize interstate emergency green corridors directly.
          </div>
        </div>

      </div>

      {/* 7 STATE CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-slate-900 text-base">Northeast State Logistics Matrix</h3>
          <span className="text-xs text-slate-500">Updated every 5 minutes from State EOCs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {NE_STATES_DATA.map(stateData => (
            <div
              key={stateData.state}
              className={`gov-card p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow ${
                stateData.blockedCorridors > 0
                  ? 'border-t-4 border-t-rose-600 bg-rose-50/20'
                  : stateData.restrictedCorridors > 0
                  ? 'border-t-4 border-t-amber-500'
                  : 'border-t-4 border-t-emerald-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm text-slate-900">{stateData.state}</span>
                  <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {stateData.connectivityIndex}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mb-2">
                  {stateData.districtsAffected}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Blocked:</span>
                    <span className={`font-bold ${stateData.blockedCorridors > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {stateData.blockedCorridors}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Restricted:</span>
                    <span className={`font-bold ${stateData.restrictedCorridors > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {stateData.restrictedCorridors}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipments:</span>
                    <span className="font-bold text-blue-600">{stateData.activeShipments}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedRoadId(stateData.state === 'Nagaland' ? 'DIM-KOH-01' : 'SIL-IMP-04');
                  setCurrentScreen('roads');
                }}
                className="mt-3 w-full py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition-colors"
              >
                View State Corridors
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
