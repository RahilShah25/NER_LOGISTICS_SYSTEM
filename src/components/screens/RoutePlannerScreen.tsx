import React, { useState } from 'react';
import {
  Compass,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Coins,
  Truck,
  Layers,
  Info,
  CheckCircle,
  HelpCircle,
  Brain,
  TrendingUp,
  Sliders,
  Cpu,
  Boxes,
  MapPin
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { CargoType, ShipmentPriority, RouteOption } from '../../types';
import { INITIAL_CITIES } from '../../data/initialData';
import { RouteAssignModal } from '../modals/RouteAssignModal';

export const RoutePlannerScreen: React.FC = () => {
  const { roads, showToast, setCurrentScreen } = useLogistics();

  const [activeTab, setActiveTab] = useState<'single' | 'cvrp'>('single');

  // Single Route Planner State
  const [origin, setOrigin] = useState('Guwahati');
  const [destination, setDestination] = useState('Imphal');
  const [cargoType, setCargoType] = useState<CargoType>('Medicine');
  const [priority, setPriority] = useState<ShipmentPriority>('Emergency');
  const [vehicle, setVehicle] = useState('Refrigerated Medical Van (TRK-221)');
  const [isCalculated, setIsCalculated] = useState(true);
  const [selectedRouteForAssign, setSelectedRouteForAssign] = useState<RouteOption | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Multi-Stop CVRP VRP Solver State (OR-Tools & VRPLIB inspired)
  const [vrpStops, setVrpStops] = useState<string[]>(['Guwahati', 'Shillong', 'Dimapur', 'Kohima', 'Imphal']);
  const [vehicleCapacityKg, setVehicleCapacityKg] = useState<number>(12000);
  const [isVrpSolved, setIsVrpSolved] = useState<boolean>(true);

  const dimKohRoad = roads.find(r => r.id === 'DIM-KOH-01');
  const isDimKohBlocked = dimKohRoad?.status === 'BLOCKED';

  const routeOptions = [
    {
      id: 'ROUTE-REC-01',
      name: 'AI Recommended Corridor (via Silchar & Wokha Bypass)',
      path: ['GUW-SIL-03', 'DIM-WOK-00', 'KOH-WOK-02'],
      nodes: ['Guwahati', 'Silchar', 'Wokha', 'Imphal'],
      distanceKm: 321,
      etaString: '7h 20m',
      riskScore: 18,
      accessibilityScore: 94,
      aiConfidence: 91,
      costTier: '₹₹',
      recommendationReason: 'AI chose this route because it circumvents the Paglapahar landslide area while maintaining high pavement accessibility and optimal cold-chain stability.',
      isRecommended: true
    },
    {
      id: 'ROUTE-ALT-02',
      name: 'Alternative Highway Transit (NH-27 / NH-2)',
      path: ['GUW-JOR-14', 'JOR-DIM-06', 'DIM-KOH-01'],
      nodes: ['Guwahati', 'Jorhat', 'Dimapur', 'Imphal'],
      distanceKm: 340,
      etaString: '8h 05m',
      riskScore: 32,
      accessibilityScore: 78,
      aiConfidence: 85,
      costTier: '₹₹₹',
      recommendationReason: 'Secondary alternative via Upper Assam plains. Experiences mild congestion near interstate border post.',
      isRecommended: false
    },
    {
      id: 'ROUTE-EMG-03',
      name: 'Emergency Escorted Corridor (Green-Channel)',
      path: ['GUW-SIL-03', 'SIL-IMP-04'],
      nodes: ['Guwahati', 'Silchar', 'Jiribam', 'Imphal'],
      distanceKm: 298,
      etaString: '6h 50m',
      riskScore: 9,
      accessibilityScore: 98,
      aiConfidence: 96,
      costTier: '₹₹₹₹',
      recommendationReason: 'Priority emergency dispatch with police escort unit assigned. Bypasses all freight weighbridges.',
      isRecommended: false
    }
  ];

  const aiExplanationFactors = [
    { label: 'Road Accessibility', percent: 35, color: 'bg-emerald-500' },
    { label: 'Weather Saturation', percent: 25, color: 'bg-blue-500' },
    { label: 'Landslide Risk Score', percent: 20, color: 'bg-amber-500' },
    { label: 'Traffic & Checkpoint Delay', percent: 10, color: 'bg-purple-500' },
    { label: 'Total Distance', percent: 10, color: 'bg-cyan-500' }
  ];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculated(true);
    showToast('success', 'AI Route Calculated', `Generated optimal route options from ${origin} to ${destination}.`);
  };

  const handleSolveCVRP = () => {
    setIsVrpSolved(true);
    showToast('success', 'OR-Tools CVRP Solved', 'Optimized multi-stop vehicle capacity routing for 5 drop locations.');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">AI Route Intelligence & VRP Solver</h1>
          </div>
          <p className="text-xs text-slate-300">
            Powered by Google OR-Tools CVRP, VRPLIB benchmark heuristics, and OpenRouteService distance matrices.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'single' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Single Route Pathfinder
          </button>
          <button
            onClick={() => setActiveTab('cvrp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'cvrp' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Multi-Stop CVRP Solver (OR-Tools)</span>
          </button>
        </div>
      </div>

      {activeTab === 'single' ? (
        <>
          {/* INPUT FORM */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Origin</label>
                  <select
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
                  >
                    {INITIAL_CITIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.state})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Destination</label>
                  <select
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
                  >
                    {INITIAL_CITIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.state})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Cargo Category</label>
                  <select
                    value={cargoType}
                    onChange={e => setCargoType(e.target.value as CargoType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Medicine">Medicine & Vaccines</option>
                    <option value="Perishable Food">Perishable Food</option>
                    <option value="Agricultural Produce">Agricultural Produce</option>
                    <option value="Construction Material">Construction Material</option>
                    <option value="Liquid Oxygen">Liquid Oxygen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as ShipmentPriority)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="High">High Priority</option>
                    <option value="Normal">Normal Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Vehicle Type</label>
                  <select
                    value={vehicle}
                    onChange={e => setVehicle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Refrigerated Medical Van (TRK-221)">Refrigerated Medical Van</option>
                    <option value="Heavy Freight (TRK-103)">Heavy Freight (16 T)</option>
                    <option value="4x4 Mini Freight (VAN-018)">4x4 Mini Freight</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Real-time optimization balancing risk vs. travel time</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Generate Optimal Route</span>
                </button>
              </div>
            </form>
          </div>

          {/* 3 ROUTE RESULTS */}
          {isCalculated && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {routeOptions.map(opt => (
                  <div
                    key={opt.id}
                    className={`p-6 rounded-2xl border transition-all space-y-4 shadow-xl flex flex-col justify-between ${
                      opt.isRecommended
                        ? 'bg-slate-900 border-blue-500 ring-2 ring-blue-500/50'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          {opt.isRecommended && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider mb-1 inline-block">
                              AI RECOMMENDED
                            </span>
                          )}
                          <h3 className="font-bold text-sm text-white">{opt.name}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Distance</div>
                          <div className="text-base font-black text-white">{opt.distanceKm} km</div>
                        </div>
                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">ETA</div>
                          <div className="text-base font-black text-emerald-400">{opt.etaString}</div>
                        </div>
                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Risk Level</div>
                          <div className="text-base font-black text-amber-400">{opt.riskScore}%</div>
                        </div>
                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Accessibility</div>
                          <div className="text-base font-black text-blue-400">{opt.accessibilityScore}%</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        {opt.recommendationReason}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          showToast('success', 'Route Selected', `Selected ${opt.name} for cargo dispatch.`);
                          setCurrentScreen('map');
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-2 ${
                          opt.isRecommended
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>Select Route</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI EXPLANATION BOX */}
              <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-4 text-xs text-slate-200 shadow-xl">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    <span>Why did AI choose this route?</span>
                  </h3>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600">
                    91% AI Confidence Rating
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Factor Contribution Weights:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {aiExplanationFactors.map((f, i) => (
                      <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>{f.label}</span>
                          <span className="font-mono font-bold text-white">{f.percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div className={`h-full ${f.color}`} style={{ width: `${f.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* MULTI-STOP CVRP SOLVER TAB (OR-Tools Reference) */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">GOOGLE OR-TOOLS VRP ENGINE</span>
                <h3 className="font-bold text-base text-white">Capacitated Vehicle Routing Problem (CVRP) Multi-Stop Solver</h3>
                <p className="text-xs text-slate-400">Solves multi-stop dropoff sequences under payload weight & time-window constraints.</p>
              </div>

              <button
                onClick={handleSolveCVRP}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <Cpu className="w-4 h-4" />
                <span>Run OR-Tools Solver</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Payload Capacity Limit</div>
                <div className="text-xl font-black text-white">{vehicleCapacityKg / 1000} Tons</div>
                <div className="text-[10px] text-slate-400">12,000 kg Max</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Multi-Stop Waypoints</div>
                <div className="text-xl font-black text-indigo-400">5 Cities</div>
                <div className="text-[10px] text-slate-400">Guwahati → Shillong → Dimapur → Kohima → Imphal</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Distance Matrix Engine</div>
                <div className="text-xl font-black text-emerald-400">OSRM Matrix API</div>
                <div className="text-[10px] text-slate-400">Real-time travel times</div>
              </div>
            </div>

            {/* Solved Result Display */}
            {isVrpSolved && (
              <div className="p-5 bg-indigo-950/40 rounded-xl border border-indigo-500/40 space-y-3 text-xs text-slate-200">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                  <span className="font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>OR-Tools Optimal Sequence Calculated</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">Cost Saved: ₹18,400</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap font-mono text-sm py-2">
                  <span className="px-3 py-1 bg-indigo-900 border border-indigo-500 rounded-lg text-white font-bold">1. Guwahati (Depot)</span>
                  <span>→</span>
                  <span className="px-3 py-1 bg-indigo-900 border border-indigo-500 rounded-lg text-white font-bold">2. Shillong (Drop 2.5T)</span>
                  <span>→</span>
                  <span className="px-3 py-1 bg-indigo-900 border border-indigo-500 rounded-lg text-white font-bold">3. Dimapur (Drop 4.0T)</span>
                  <span>→</span>
                  <span className="px-3 py-1 bg-indigo-900 border border-indigo-500 rounded-lg text-white font-bold">4. Kohima (Drop 3.0T)</span>
                  <span>→</span>
                  <span className="px-3 py-1 bg-indigo-900 border border-indigo-500 rounded-lg text-white font-bold">5. Imphal (Drop 2.5T)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div><span className="text-slate-400">Total Distance:</span> <strong className="text-white">542 km</strong></div>
                  <div><span className="text-slate-400">Total Duration:</span> <strong className="text-white">11h 45m</strong></div>
                  <div><span className="text-slate-400">Capacity Used:</span> <strong className="text-emerald-400">100% (12.0 Tons)</strong></div>
                  <div><span className="text-slate-400">Risk Cost Penalty:</span> <strong className="text-emerald-400">Low (14/100)</strong></div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
