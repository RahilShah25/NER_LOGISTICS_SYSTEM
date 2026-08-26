import React, { useState } from 'react';
import {
  LayoutDashboard,
  BellRing,
  FileSpreadsheet,
  User,
  Menu,
  X,
  Layers,
  Brain,
  CloudLightning,
  Truck,
  Compass,
  Building2,
  Sliders,
  ShieldCheck,
  Radio,
  Globe,
  Cpu
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export const MobileBottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, alerts } = useLogistics();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const criticalCount = alerts.filter(a => a.severity === 'Critical' && !a.isResolved).length;

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'map', label: 'Map', icon: <Layers className="w-5 h-5" /> },
    { id: 'alerts', label: 'Alerts', icon: <BellRing className="w-5 h-5" />, badge: criticalCount > 0 ? criticalCount : undefined },
    { id: 'field-report', label: 'Report', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: 'settings', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  const moreModules = [
    { id: 'landing', label: 'Portal Home', icon: <Globe className="w-4 h-4 text-teal-600" /> },
    { id: 'disruptions', label: 'AI Disruption Prediction', icon: <Brain className="w-4 h-4 text-teal-600" /> },
    { id: 'weather', label: 'Weather Intelligence', icon: <CloudLightning className="w-4 h-4 text-cyan-600" /> },
    { id: 'route-planner', label: 'AI Route Planner', icon: <Compass className="w-4 h-4 text-teal-600" /> },
    { id: 'vehicles', label: 'Fleet Intelligence', icon: <Truck className="w-4 h-4 text-teal-600" /> },
    { id: 'shipments', label: 'Essential Supply Chain', icon: <Truck className="w-4 h-4 text-slate-500" /> },
    { id: 'emergency', label: 'Emergency Command', icon: <Radio className="w-4 h-4 text-rose-600" /> },
    { id: 'infrastructure', label: 'Infrastructure Assets', icon: <Building2 className="w-4 h-4 text-slate-500" /> },
    { id: 'integrations', label: 'System Integrations', icon: <Cpu className="w-4 h-4 text-slate-500" /> },
    { id: 'audit-logs', label: 'Audit & Security', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> }
  ];

  return (
    <>
      {/* Mobile Drawer */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col justify-end animate-fadeIn">
          <div className="bg-white border-t border-slate-200 rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-bold text-sm text-slate-900">Platform Modules</span>
              <button onClick={() => setIsMoreOpen(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {moreModules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => {
                    setCurrentScreen(mod.id);
                    setIsMoreOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    currentScreen === mod.id
                      ? 'bg-teal-600 text-white border-teal-500 font-bold shadow-sm'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {mod.icon}
                  <span className="truncate">{mod.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 text-slate-500 py-1.5 px-2 flex items-center justify-around shadow-xl font-sans">
        {mainTabs.map(tab => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentScreen(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg relative transition-colors ${
                isActive ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 bg-amber-500 text-slate-950 font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-500 hover:text-slate-800"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </nav>
    </>
  );
};
