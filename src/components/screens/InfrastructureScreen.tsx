import React, { useState } from 'react';
import {
  Building2,
  Warehouse,
  Hospital,
  Fuel,
  ShieldCheck,
  Search,
  Plus,
  Phone,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Layers,
  MapPin
} from 'lucide-react';
import { INITIAL_INFRASTRUCTURE } from '../../data/initialData';

export const InfrastructureScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredAssets = INITIAL_INFRASTRUCTURE.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || asset.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Infrastructure Intelligence Registry</h1>
          </div>
          <p className="text-xs text-slate-300">
            Monitoring structural integrity, health scores, and operational status for strategic bridges, tunnels, cold stores, and oxygen plants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xl font-black text-emerald-400">94.2%</div>
            <div className="text-[10px] text-slate-400 font-medium uppercase">Operational Health</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bridge, tunnel, hospital..."
            className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['all', 'Bridge', 'Tunnel', 'Warehouse', 'Hospital', 'Fuel Station', 'Relief Center'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type === 'all' ? 'All Assets' : type}
            </button>
          ))}
        </div>

      </div>

      {/* Infrastructure Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map(asset => (
          <div
            key={asset.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">{asset.id} • {asset.type}</span>
                  <h3 className="font-bold text-base text-white">{asset.name}</h3>
                  <div className="text-xs text-slate-400">{asset.state} ({asset.district})</div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  asset.condition === 'Operational' ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' :
                  asset.condition === 'Requires Inspection' ? 'bg-amber-950 text-amber-300 border border-amber-600' : 'bg-rose-950 text-rose-300 border border-rose-600'
                }`}>
                  ● {asset.condition}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Risk Index</div>
                  <div className="font-bold text-amber-400">{asset.riskScore} / 100</div>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Last Inspection</div>
                  <div className="font-bold text-white">{asset.lastInspected}</div>
                </div>
              </div>

              {asset.capacity && (
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-white">Design Capacity: </span>
                  {asset.capacity}
                </div>
              )}

              <div className="space-y-1 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>{asset.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{asset.phone}</span>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-slate-500">{asset.location}</span>
              <button className="text-blue-400 hover:text-blue-300 font-bold text-xs">
                View Inspection Log &rarr;
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
