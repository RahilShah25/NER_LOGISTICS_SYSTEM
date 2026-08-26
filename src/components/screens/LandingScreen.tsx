import React from 'react';
import {
  ShieldAlert,
  Navigation,
  CloudLightning,
  Truck,
  Activity,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Lock,
  Layers,
  Radio,
  FileText
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { NortheastIndiaMap } from '../map/NortheastIndiaMap';

export const LandingScreen: React.FC = () => {
  const { setCurrentScreen, t } = useLogistics();

  const featureCards = [
    {
      icon: Layers,
      title: "Live GIS Monitoring",
      desc: "Real-time Leaflet GIS map tracking 15 major corridors, bridges, terrain slopes, and weather hazards across all 8 North-Eastern states."
    },
    {
      icon: Navigation,
      title: "AI Route Optimization",
      desc: "Cargo-aware routing algorithms prioritizing life-saving pharmaceuticals and essential supplies around active landslides and floods."
    },
    {
      icon: CloudLightning,
      title: "Predictive Disruption Alerts",
      desc: "IMD weather radar and NESAC satellite telemetry predicting landslide risks up to 7 days before road collapse."
    },
    {
      icon: Truck,
      title: "GPS Fleet Intelligence",
      desc: "Live vehicle telematics tracking speed, fuel, driver status, and cold-chain temperature thresholds."
    },
    {
      icon: Radio,
      title: "Emergency Command Center",
      desc: "Instant disaster mobilization routing emergency medical units, NDRF heavy machinery, and relief shelters."
    },
    {
      icon: FileText,
      title: "Offline Field Reporting",
      desc: "Field officer mobile web app capturing GPS coordinates, photos, and hazard reports even in zero-cellular dead zones."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      
      {/* Top Header Bar for Landing */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white font-black text-lg tracking-tighter">
            NL
          </div>
          <div>
            <div className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              <span>NER-LINK AI</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-700/60 uppercase">
                SIH 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">North Eastern Region Logistics & Accessibility Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('login')}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
          >
            Sign In
          </button>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-lg shadow-teal-600/30 flex items-center gap-1.5"
          >
            <span>Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 lg:px-12 py-12 lg:py-20 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-950/80 border border-teal-600/40 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-Powered Regional Logistics & Accessibility Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            AI-Powered Logistics Intelligence for a Connected{' '}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
              North Eastern Region
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
            “Monitor accessibility, predict disruptions, optimize transportation routes, track essential supplies, and coordinate emergency response from one intelligent platform.”
          </p>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium italic border-l-4 border-l-teal-500 max-w-xl mx-auto lg:mx-0 shadow-lg">
            “See the disruption. Predict the risk. Optimize the route. Deliver without interruption.”
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-teal-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Enter Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentScreen('map')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Explore Platform Map</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">8 States</div>
              <div className="text-[11px] text-slate-400 font-medium">Full Coverage</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">15 Corridors</div>
              <div className="text-[11px] text-slate-400 font-medium">Live Telemetry</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-teal-400">91% AI Acc</div>
              <div className="text-[11px] text-slate-400 font-medium">Risk Prediction</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">Offline-Ready</div>
              <div className="text-[11px] text-slate-400 font-medium">Zero-Cell Sync</div>
            </div>
          </div>

        </div>

        {/* Interactive Regional Map Preview */}
        <div className="w-full lg:w-[520px] rounded-2xl border border-slate-800 p-2.5 bg-slate-900/90 shadow-2xl space-y-2">
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              NER GIS LIVE TELEMETRY GRID
            </span>
            <span>SIH 2026 DEMO</span>
          </div>

          <NortheastIndiaMap heightClass="h-[360px] sm:h-[420px]" />

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>DIM-KOH-01 Paglapahar Landslide Active</span>
            </div>
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="text-[11px] font-bold text-teal-400 hover:text-teal-300 underline"
            >
              View Reroute &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Built for Government, Emergency & Logistics Operators
            </h2>
            <p className="text-slate-400 text-sm">
              Comprehensive decision-support infrastructure engineered specifically for hill terrain challenges in North East India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all space-y-3 group shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-600/10 border border-teal-500/30 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-6 px-4 sm:px-8 bg-slate-950 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; 2026 NER-LINK AI — North Eastern Region Logistics & Accessibility Intelligence Network (SIH 2026)
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button onClick={() => setCurrentScreen('dashboard')} className="hover:text-white">Command Dashboard</button>
          <span>•</span>
          <button onClick={() => setCurrentScreen('login')} className="hover:text-white">Government Login</button>
          <span>•</span>
          <button onClick={() => setCurrentScreen('map')} className="hover:text-white">GIS Map</button>
        </div>
      </footer>

    </div>
  );
};
