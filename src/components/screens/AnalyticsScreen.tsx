import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Truck,
  Sparkles,
  Calendar,
  Filter,
  Download,
  CheckCircle,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const AnalyticsScreen: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7D');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  // Sample historical demo intelligence data
  const accessibilityHistory = [
    { time: '08:00', open: 14, blocked: 0, restricted: 1 },
    { time: '10:00', open: 14, blocked: 0, restricted: 2 },
    { time: '12:00', open: 13, blocked: 1, restricted: 2 },
    { time: '14:00', open: 12, blocked: 1, restricted: 2 },
    { time: '16:00', open: 12, blocked: 1, restricted: 3 },
    { time: '18:00', open: 13, blocked: 1, restricted: 2 },
  ];

  const blockedByDistrictData = [
    { name: 'Dimapur', blocked: 1, restricted: 0, open: 4 },
    { name: 'Kohima', blocked: 0, restricted: 1, open: 3 },
    { name: 'Cachar', blocked: 0, restricted: 1, open: 5 },
    { name: 'Imphal', blocked: 0, restricted: 1, open: 3 },
    { name: 'Tamenglong', blocked: 0, restricted: 1, open: 2 },
    { name: 'Kamrup', blocked: 0, restricted: 0, open: 6 },
  ];

  const delayByCargoData = [
    { cargo: 'Medicine', avgDelay: 25, rerouteSuccess: 96 },
    { cargo: 'Perishable Food', avgDelay: 35, rerouteSuccess: 91 },
    { cargo: 'Agriculture', avgDelay: 60, rerouteSuccess: 84 },
    { cargo: 'Construction', avgDelay: 95, rerouteSuccess: 78 },
    { cargo: 'Liquid Oxygen', avgDelay: 10, rerouteSuccess: 99 },
  ];

  const incidentTypeData = [
    { name: 'Landslide', value: 42, color: '#dc2626' },
    { name: 'Flash Flood', value: 26, color: '#2563eb' },
    { name: 'Heavy Rainfall', value: 18, color: '#d97706' },
    { name: 'Road Cavitation', value: 14, color: '#64748b' },
  ];

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Logistics Intelligence & Analytics
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Northeast Corridor Performance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Predictive corridor uptime, cargo delay mitigation and autonomous rerouting efficacy
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="24H">Last 24 Hours</option>
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="MONSOON">Monsoon Season 2026</option>
          </select>
        </div>
      </div>

      {/* AI SUMMARY BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 rounded-xl shadow-md border border-blue-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/30 text-blue-300 border border-blue-400/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-blue-300 font-bold">
              LOGISTICS RESILIENCE METRIC:
            </div>
            <div className="text-base sm:text-lg font-black text-white mt-0.5">
              “Medicine shipments avoided 86% of high-risk segments via automated bypasses.”
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-center">
          <div className="px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-700">
            <span className="text-[10px] text-blue-300 uppercase block font-bold">Reroute Success</span>
            <span className="text-base font-black text-emerald-400">94.8%</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-700">
            <span className="text-[10px] text-blue-300 uppercase block font-bold">Avg Divert Saved</span>
            <span className="text-base font-black text-blue-300">4.2 hrs</span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Corridor Accessibility Over Time (7 Cols) */}
        <div className="lg:col-span-7 gov-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Corridor Accessibility Timeline</h3>
              <p className="text-[11px] text-slate-500">Live operational corridors vs disruptions</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              88% Average Uptime
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accessibilityHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="open" stackId="1" stroke="#16a34a" fill="#dcfce7" name="Open Corridors" />
                <Area type="monotone" dataKey="restricted" stackId="1" stroke="#d97706" fill="#fef3c7" name="Restricted" />
                <Area type="monotone" dataKey="blocked" stackId="1" stroke="#dc2626" fill="#fee2e2" name="Blocked" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hazard Frequency Breakdown (5 Cols) */}
        <div className="lg:col-span-5 gov-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Incident Causes & Hazards</h3>
              <p className="text-[11px] text-slate-500">Breakdown of reported road disruptions</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {incidentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={value => <span className="text-xs text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Shipment Delay by Commodity (6 Cols) */}
        <div className="lg:col-span-6 gov-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Average Transit Delay by Cargo (Mins)</h3>
              <p className="text-[11px] text-slate-500">Lower is better • Medicine receives green-corridor priority</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayByCargoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="cargo" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="avgDelay" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Avg Delay (Mins)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Blockages Breakdown (6 Cols) */}
        <div className="lg:col-span-6 gov-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Corridor Health by District</h3>
              <p className="text-[11px] text-slate-500">Open vs Restricted vs Blocked corridors</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blockedByDistrictData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="open" fill="#10b981" stackId="a" name="Open" />
                <Bar dataKey="restricted" fill="#f59e0b" stackId="a" name="Restricted" />
                <Bar dataKey="blocked" fill="#ef4444" stackId="a" name="Blocked" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
