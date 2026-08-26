import React, { useState } from 'react';
import {
  CloudRain,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  CloudLightning,
  AlertTriangle,
  Sparkles,
  MapPin,
  RefreshCw,
  Sun,
  Cloud
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export const WeatherIntelligenceScreen: React.FC = () => {
  const { setCurrentScreen } = useLogistics();
  const [selectedState, setSelectedState] = useState<string>('Meghalaya');

  const weatherStats = [
    { label: 'Temperature', value: '21.4°C', sub: 'High 23° / Low 18°', icon: Thermometer, color: 'amber' },
    { label: 'Sustained Rainfall', value: '64 mm/h', sub: 'Extreme Downpour', icon: CloudRain, color: 'blue' },
    { label: 'Relative Humidity', value: '96%', sub: 'Saturated Soil', icon: Droplets, color: 'cyan' },
    { label: 'Wind Velocity', value: '42 km/h', sub: 'Gusts up to 60 km/h', icon: Wind, color: 'teal' },
    { label: 'Visibility', value: '450 meters', sub: 'Dense Mountain Fog', icon: Eye, color: 'rose' }
  ];

  const stateForecasts = [
    { state: 'Assam', temp: '28°C', rain: '14 mm/h', status: 'Moderate Rain', risk: 'Low' },
    { state: 'Meghalaya', temp: '21°C', rain: '64 mm/h', status: 'Torrential Downpour', risk: 'Critical' },
    { state: 'Nagaland', temp: '22°C', rain: '48 mm/h', status: 'Heavy Downpour', risk: 'High' },
    { state: 'Manipur', temp: '24°C', rain: '38 mm/h', status: 'Thunderstorms', risk: 'High' },
    { state: 'Mizoram', temp: '23°C', rain: '18 mm/h', status: 'Light Rain', risk: 'Low' },
    { state: 'Tripura', temp: '29°C', rain: '8 mm/h', status: 'Partly Cloudy', risk: 'Low' },
    { state: 'Arunachal Pradesh', temp: '16°C', rain: '32 mm/h', status: 'Slush & Dense Fog', risk: 'High' },
    { state: 'Sikkim', temp: '14°C', rain: '22 mm/h', status: 'Cold Drizzle', risk: 'Medium' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <CloudLightning className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Weather Intelligence Center</h1>
          </div>
          <p className="text-xs text-slate-300">
            Real-time Doppler Radar, cloud precipitation layers, and IMD weather risk telemetry for all 8 states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-mono font-bold text-slate-300">IMD LIVE FEED 14:35 IST</span>
        </div>
      </div>

      {/* AI Hazard Callout Banner */}
      <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-200 text-xs flex items-start gap-3 shadow-lg">
        <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-white text-sm">AI Weather Hazard Warning</div>
          <p className="leading-relaxed">
            “Heavy rainfall is expected in Meghalaya and Nagaland hills within the next 6 hours. 14 critical transportation routes may experience accessibility degradation.”
          </p>
        </div>
      </div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {weatherStats.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">{stat.label}</span>
                <div className={`p-1.5 rounded-lg bg-${stat.color}-950 text-${stat.color}-400 border border-${stat.color}-800`}>
                  <IconComp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-slate-400 font-medium">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Regional State Forecast Comparison Grid */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span>All 8 States Weather Status & Impact Risk</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stateForecasts.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedState(item.state)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedState === item.state
                  ? 'bg-blue-950/60 border-blue-500 shadow-xl'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{item.state}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.risk === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-600' :
                  item.risk === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-600' : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                }`}>
                  {item.risk} Risk
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-black text-white">{item.temp}</span>
                <span className="text-xs font-mono font-semibold text-blue-400">{item.rain}</span>
              </div>

              <div className="text-xs text-slate-400 mt-1">{item.status}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
