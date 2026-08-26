import React, { useState } from 'react';
import {
  Sliders,
  Users,
  GitFork,
  Building2,
  PhoneCall,
  Save,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Shield,
  Layers,
  Database
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export const AdminScreen: React.FC = () => {
  const { riskWeights, setRiskWeights, roads, shipments, incidents, resetToInitialDemoState, showToast } = useLogistics();

  const [activeTab, setActiveTab] = useState<'risk' | 'corridors' | 'users' | 'sms' | 'system'>('risk');

  // Sliders for dynamic weights
  const [rainfall, setRainfall] = useState(riskWeights.rainfall);
  const [historical, setHistorical] = useState(riskWeights.historical);
  const [terrain, setTerrain] = useState(riskWeights.terrain);

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    setRiskWeights({ rainfall, historical, terrain });
    showToast('success', 'Risk Configuration Saved', `Updated weights: Rainfall ${rainfall}%, Historical ${historical}%, Terrain ${terrain}%.`);
  };

  const usersList = [
    { name: 'K. Angami', email: 'k.angami@nagaland.gov.in', role: 'Field Worker', district: 'Dimapur', phone: '+91 94360 11223' },
    { name: 'Dr. R. Sharma', email: 'r.sharma@ner-logistics.gov.in', role: 'District Officer', district: 'Dimapur', phone: '+91 98620 44556' },
    { name: 'Col. S. Thapa', email: 's.thapa@regional-cmd.gov.in', role: 'State Officer', district: 'All Northeast', phone: '+91 94350 99887' },
    { name: 'M. Hazarika', email: 'm.hazarika@fci-assam.gov.in', role: 'Logistics Operator', district: 'Kamrup Metro', phone: '+91 97740 33221' },
    { name: 'Admin Operations', email: 'admin@ner-logistics.gov.in', role: 'Administrator', district: 'Central Command', phone: '+91 94361 00000' }
  ];

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              System Administration & Risk Weightings
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Admin Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure risk formula algorithms, SMS gateways, corridor registry, and user roles
          </p>
        </div>

        <button
          onClick={resetToInitialDemoState}
          className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      {/* TABS BAR */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'risk', label: 'Risk Configuration', icon: <Sliders className="w-4 h-4" /> },
          { id: 'corridors', label: 'Road Corridors Registry', icon: <GitFork className="w-4 h-4" /> },
          { id: 'users', label: 'Authorized Officers', icon: <Users className="w-4 h-4" /> },
          { id: 'sms', label: 'SMS / IVR Gateway Settings', icon: <PhoneCall className="w-4 h-4" /> },
          { id: 'system', label: 'System Parameters', icon: <Database className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: RISK CONFIGURATION */}
      {activeTab === 'risk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          <div className="lg:col-span-7 gov-card p-5 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Composite Risk Formula Weightings</h3>
              <p className="text-xs text-slate-500">
                Adjust the relative contribution of each hazard dimension to the 0-100 risk score
              </p>
            </div>

            <form onSubmit={handleSaveWeights} className="space-y-5 text-xs">
              {/* Rainfall Slider */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-blue-50/50 border border-blue-200">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>🌧️ Real-Time Rainfall & Soil Moisture Weight:</span>
                  <span className="font-mono text-blue-700 text-sm">{rainfall}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={rainfall}
                  onChange={e => setRainfall(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10% (Low IMD influence)</span>
                  <span>70% (Monsoon Heavy)</span>
                </div>
              </div>

              {/* Historical Incidents Slider */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>⚠️ Historical Landslide Frequency Weight:</span>
                  <span className="font-mono text-amber-800 text-sm">{historical}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={historical}
                  onChange={e => setHistorical(Number(e.target.value))}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10% (Static)</span>
                  <span>60% (High Memory)</span>
                </div>
              </div>

              {/* Terrain Gradient Slider */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-rose-50/50 border border-rose-200">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>⛰️ Slope Gradient & Geological Terrain Vulnerability:</span>
                  <span className="font-mono text-rose-700 text-sm">{terrain}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={terrain}
                  onChange={e => setTerrain(Number(e.target.value))}
                  className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5% (Plains)</span>
                  <span>50% (High Altitude Hills)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-700">
                <strong>Current Formula:</strong> Risk = ({rainfall}% × IMD Rainfall) + ({historical}% × 5-Yr History) + ({terrain}% × GSI Slope Factor)
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save & Recalculate Network</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 gov-card p-5 space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Automated Decision Thresholds</h3>
              <p className="text-xs text-slate-500">
                Threshold triggers for automated rerouting and alarm generation
              </p>

              <div className="mt-4 space-y-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="font-bold text-slate-900">Critical Alert Trigger</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Risk Score ≥ 80 or Road Blockage declared</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="font-bold text-slate-900">Medicine Auto-Reroute</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Diverts if primary corridor risk ≥ 65</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="font-bold text-slate-900">Escalation SLA Timeout</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Auto-escalates to State Command after 15 minutes of unacknowledged blockage</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Government Decision Layer Engine • Calibration Profile: NER Monsoon 2026
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: USERS LIST */}
      {activeTab === 'users' && (
        <div className="gov-card overflow-hidden shadow-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                <th className="py-3 px-4 text-left">Officer Name</th>
                <th className="py-3 px-4 text-left">Official Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Assigned District</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                  <td className="py-3 px-4 font-semibold text-blue-700">{u.role}</td>
                  <td className="py-3 px-4 text-slate-700">{u.district}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{u.phone}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: CORRIDORS */}
      {activeTab === 'corridors' && (
        <div className="gov-card overflow-hidden shadow-sm">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
            <span>Registered National & State Corridors ({roads.length})</span>
            <span className="text-[11px] text-slate-500">Synced with Ministry of Road Transport & Highways</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                <th className="py-2.5 px-4 text-left">Code</th>
                <th className="py-2.5 px-4 text-left">Corridor</th>
                <th className="py-2.5 px-4 text-left">Length</th>
                <th className="py-2.5 px-4 text-left">Status</th>
                <th className="py-2.5 px-4 text-left">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roads.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-700">{r.id}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{r.name}</td>
                  <td className="py-2.5 px-4 text-slate-600">{r.lengthKm} km</td>
                  <td className="py-2.5 px-4 font-bold text-slate-800">{r.status}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-800">{r.riskScore}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: SMS */}
      {activeTab === 'sms' && (
        <div className="gov-card p-5 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">SMS / IVR Gateway Daemon Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">National Informatics Centre (NIC) SMS API Key</label>
              <input type="password" value="NIC-SMS-SECURE-KEY-8941047120" readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-700" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dedicated Shortcode</label>
              <input type="text" value="51969" readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-blue-700" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Interactive Voice Response (IVR) Primary Trunk</label>
              <input type="text" value="+91 1800-345-LOGIS" readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-700" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Offline Sync DB Protocol</label>
              <input type="text" value="AES-256 Encrypted Local SQLite / IndexedDB" readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-700" />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SYSTEM */}
      {activeTab === 'system' && (
        <div className="gov-card p-5 space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">System Parameters & Telemetry Health</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Decision Engine</span>
              <span className="font-bold text-emerald-600">v2.4 Online (99.98%)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">IMD Weather Sync</span>
              <span className="font-bold text-blue-600">Polling every 15m</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">IoT Sensors Connected</span>
              <span className="font-bold text-slate-900">48 Telemetry Nodes</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Active State Nodes</span>
              <span className="font-bold text-purple-600">7 Northeast States</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
