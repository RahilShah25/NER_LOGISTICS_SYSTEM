import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  AlertTriangle,
  Clock,
  CloudRain,
  Mountain,
  Waves,
  Car,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export const DisruptionPredictionScreen: React.FC = () => {
  const { setCurrentScreen } = useLogistics();
  const [timeFilter, setTimeFilter] = useState<'6H' | '12H' | '24H' | '3D' | '7D'>('24H');

  const timeOptions = [
    { id: '6H', label: '6 Hours' },
    { id: '12H', label: '12 Hours' },
    { id: '24H', label: '24 Hours' },
    { id: '3D', label: '3 Days' },
    { id: '7D', label: '7 Days' }
  ];

  const predictions = [
    {
      id: 'PRED-01',
      title: 'Paglapahar Hill Slope Landslide',
      type: 'Landslide',
      riskScore: 78,
      confidence: 89,
      icon: Mountain,
      color: 'rose',
      location: 'DIM-KOH-01 (NH-29 KM 42+300)',
      timeframe: 'Next 6 - 12 Hours',
      reason: 'Sustained precipitation (42mm/hr) pushing soil saturation beyond 94% critical threshold on 42-degree slope.',
      inputFactors: [
        { label: 'Rainfall Saturation', weight: '35%' },
        { label: 'Slope Vulnerability', weight: '25%' },
        { label: 'Historical Incident Frequency', weight: '20%' },
        { label: 'Pavement Stress', weight: '10%' },
        { label: 'Seismic Tremor Micro-vibrations', weight: '10%' }
      ],
      recommendation: 'Monitor corridor closely and prepare alternate route via Wokha bypass (DIM-WOK-00).'
    },
    {
      id: 'PRED-02',
      title: 'Barak River Culvert Flash Flood Overspill',
      type: 'Flood',
      riskScore: 52,
      confidence: 84,
      icon: Waves,
      color: 'amber',
      location: 'SIL-IMP-04 (NH-37 Jiribam Sector)',
      timeframe: 'Next 12 - 24 Hours',
      reason: 'Upstream catchment rainfall in Tamenglong hills accelerating river cresting speed.',
      inputFactors: [
        { label: 'River Water Level', weight: '40%' },
        { label: 'Upstream Precipitation', weight: '30%' },
        { label: 'Culvert Drainage Rate', weight: '20%' },
        { label: 'Siltation Level', weight: '10%' }
      ],
      recommendation: 'Issue single-lane restriction for low-clearance vehicles; escort heavy cargo.'
    },
    {
      id: 'PRED-03',
      title: 'Monsoon Torrential Downpour & Fog',
      type: 'Heavy Rainfall',
      riskScore: 84,
      confidence: 93,
      icon: CloudRain,
      color: 'blue',
      location: 'Ri-Bhoi Plateau & East Khasi Hills (NH-6)',
      timeframe: 'Next 24 Hours',
      reason: 'IMD Doppler Radar indicates concentrated convective cloud band over Meghalaya escarpment.',
      inputFactors: [
        { label: 'Doppler Radar Reflectivity', weight: '45%' },
        { label: 'Humidity & Dewpoint Gap', weight: '25%' },
        { label: 'Wind Velocity Vector', weight: '20%' },
        { label: 'Barometric Drop', weight: '10%' }
      ],
      recommendation: 'Activate fog warning beacons; restrict nighttime high-speed freight convoys.'
    },
    {
      id: 'PRED-04',
      title: 'Border Post Freight Bottleneck Congestion',
      type: 'Traffic Congestion',
      riskScore: 28,
      confidence: 76,
      icon: Car,
      color: 'emerald',
      location: 'Jorhat–Dimapur Checkpoint (NH-29)',
      timeframe: 'Next 3 Days',
      reason: 'Seasonal agricultural tea transit overlap with weekend interstate permit checks.',
      inputFactors: [
        { label: 'Permit Verification Delay', weight: '50%' },
        { label: 'Truck Queue Length', weight: '30%' },
        { label: 'Lane Width Narrowing', weight: '20%' }
      ],
      recommendation: 'Enable pre-cleared electronic FASTag green-channel clearance for perishables.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">AI Disruption Prediction Center</h1>
          </div>
          <p className="text-xs text-slate-300">
            Multi-factor ML predictive engine analyzing satellite radar, slope telemetry, and historical landslide data across 8 states.
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-stretch md:self-auto overflow-x-auto">
          {timeOptions.map(t => (
            <button
              key={t.id}
              onClick={() => setTimeFilter(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeFilter === t.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.map(pred => {
          const IconComp = pred.icon;
          return (
            <div
              key={pred.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-${pred.color}-950/80 border border-${pred.color}-600/40 text-${pred.color}-400`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">{pred.id} • {pred.type}</div>
                      <h3 className="font-bold text-base text-white">{pred.title}</h3>
                      <div className="text-xs text-slate-400">{pred.location}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-rose-400">{pred.riskScore}%</div>
                    <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {pred.confidence}% Conf
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-white">AI Reason: </span>
                  {pred.reason}
                </div>

                {/* Input Factor Breakdown */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Input Risk Factors:</span>
                    <span>Weight</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {pred.inputFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/60">
                        <span>{factor.label}</span>
                        <span className="font-mono font-bold text-indigo-400">{factor.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/30 text-xs text-indigo-200">
                  <span className="font-bold text-white">Recommendation: </span>
                  “{pred.recommendation}”
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => setCurrentScreen('route-planner')}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
                >
                  <span>Pre-Plan Alternate Route</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
