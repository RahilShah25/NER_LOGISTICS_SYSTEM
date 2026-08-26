import React from 'react';
import {
  LayoutDashboard,
  Building2,
  GitFork,
  AlertOctagon,
  Truck,
  Compass,
  BellRing,
  FileSpreadsheet,
  CloudOff,
  BarChart3,
  Sliders,
  User,
  Layers,
  ChevronLeft,
  ChevronRight,
  Brain,
  CloudLightning,
  Radio,
  ShieldCheck,
  Cpu,
  Globe
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const {
    currentScreen,
    setCurrentScreen,
    roads,
    shipments,
    incidents,
    alerts,
    offlineReports
  } = useLogistics();

  const blockedRoadsCount = roads.filter(r => r.status === 'BLOCKED').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical' && !a.isResolved).length;
  const activeShipmentsCount = shipments.filter(s => s.status !== 'DELIVERED').length;
  const pendingOfflineCount = offlineReports.filter(r => r.syncStatus === 'pending').length;
  const unresolvedIncidentsCount = incidents.filter(i => i.status === 'Unresolved').length;

  const navItems = [
    {
      id: 'landing',
      label: 'Portal Home',
      icon: <Globe className="w-4 h-4 text-teal-400" />,
      category: 'Overview'
    },
    {
      id: 'dashboard',
      label: 'Command Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />,
      category: 'Overview'
    },
    {
      id: 'map',
      label: 'Live GIS Map',
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      category: 'Overview'
    },
    {
      id: 'disruptions',
      label: 'AI Disruption Prediction',
      icon: <Brain className="w-4 h-4 text-teal-400" />,
      category: 'Intelligence'
    },
    {
      id: 'weather',
      label: 'Weather Intelligence',
      icon: <CloudLightning className="w-4 h-4 text-cyan-400" />,
      category: 'Intelligence'
    },
    {
      id: 'route-planner',
      label: 'AI Route Planner',
      icon: <Compass className="w-4 h-4 text-teal-400" />,
      category: 'Intelligence'
    },
    {
      id: 'vehicles',
      label: 'Fleet Intelligence',
      icon: <Truck className="w-4 h-4 text-teal-400" />,
      badge: `${activeShipmentsCount}`,
      badgeColor: 'bg-teal-950 text-teal-300 border border-teal-700/80',
      category: 'Operations'
    },
    {
      id: 'shipments',
      label: 'Essential Supply Chain',
      icon: <Truck className="w-4 h-4 text-slate-400" />,
      category: 'Operations'
    },
    {
      id: 'roads',
      label: 'Roads & Corridors',
      icon: <GitFork className="w-4 h-4 text-slate-400" />,
      badge: blockedRoadsCount > 0 ? `${blockedRoadsCount} Blocked` : undefined,
      badgeColor: 'bg-rose-950 text-rose-300 border border-rose-800 font-bold',
      category: 'Operations'
    },
    {
      id: 'incidents',
      label: 'Incident Management',
      icon: <AlertOctagon className="w-4 h-4 text-amber-400" />,
      badge: unresolvedIncidentsCount > 0 ? `${unresolvedIncidentsCount}` : undefined,
      badgeColor: 'bg-amber-950 text-amber-300',
      category: 'Operations'
    },
    {
      id: 'alerts',
      label: 'Alert Center',
      icon: <BellRing className="w-4 h-4 text-rose-400" />,
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount} Critical` : undefined,
      badgeColor: 'bg-rose-600 text-white font-bold',
      category: 'Operations'
    },
    {
      id: 'emergency',
      label: 'Emergency Command',
      icon: <Radio className="w-4 h-4 text-rose-400" />,
      badge: 'NDRF',
      badgeColor: 'bg-rose-950 text-rose-300 border border-rose-800 font-bold',
      category: 'Field & Emergency'
    },
    {
      id: 'field-report',
      label: 'Field Incident Report',
      icon: <FileSpreadsheet className="w-4 h-4 text-slate-400" />,
      category: 'Field & Emergency'
    },
    {
      id: 'offline-queue',
      label: 'Offline Sync Queue',
      icon: <CloudOff className="w-4 h-4 text-amber-400" />,
      badge: pendingOfflineCount > 0 ? `${pendingOfflineCount} Pending` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold animate-pulse',
      category: 'Field & Emergency'
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure Assets',
      icon: <Building2 className="w-4 h-4 text-slate-400" />,
      category: 'Administration'
    },
    {
      id: 'integrations',
      label: 'System Integrations',
      icon: <Cpu className="w-4 h-4 text-slate-400" />,
      category: 'Administration'
    },
    {
      id: 'audit-logs',
      label: 'Audit & Security Trail',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      category: 'Administration'
    },
    {
      id: 'admin',
      label: 'System Admin',
      icon: <Sliders className="w-4 h-4 text-slate-400" />,
      category: 'Administration'
    },
    {
      id: 'settings',
      label: 'Profile Settings',
      icon: <User className="w-4 h-4 text-slate-400" />,
      category: 'Administration'
    }
  ];

  const categories = Array.from(new Set(navItems.map(item => item.category)));

  return (
    <aside
      className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-200 select-none z-30 font-sans ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Header / Collapse Button */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        {!isCollapsed && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Nordic Menu
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors mx-auto"
          title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-3">
        {categories.map(category => (
          <div key={category} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                {category}
              </div>
            )}
            {navItems
              .filter(item => item.category === category)
              .map(item => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={isActive ? 'text-white' : ''}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[10px] text-slate-400 flex items-center justify-between">
          <span>NER Nordic Engine</span>
          <span className="text-teal-400 font-bold">v3.2</span>
        </div>
      )}
    </aside>
  );
};
