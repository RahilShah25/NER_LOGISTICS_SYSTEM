import React, { useState } from 'react';
import {
  Shield,
  Radio,
  Wifi,
  WifiOff,
  Bell,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Layers,
  Globe,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Bot,
  Search,
  Activity
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { Language, UserRole } from '../../types';

interface TopNavBarProps {
  onOpenAiCopilot?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ onOpenAiCopilot }) => {
  const {
    isOnline,
    setIsOnline,
    activeDistrict,
    setActiveDistrict,
    currentRole,
    setCurrentRole,
    language,
    setLanguage,
    alerts,
    setIsSmsModalOpen,
    setCurrentScreen,
    isLiveStreaming,
    setIsLiveStreaming,
    t
  } = useLogistics();

  const [isDistrictMenuOpen, setIsDistrictMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isAlertsDropdownOpen, setIsAlertsDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const unresolvedAlerts = alerts.filter(a => !a.isResolved);
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && !a.isResolved).length;

  const districtsList = [
    'Dimapur',
    'Kohima',
    'Wokha',
    'Kamrup Metro (Guwahati)',
    'Cachar (Silchar)',
    'Imphal West',
    'Tamenglong',
    'East Khasi Hills (Shillong)',
    'Aizawl',
    'Papum Pare (Itanagar)'
  ];

  const rolesList: UserRole[] = [
    'District Officer',
    'State Officer',
    'Logistics Operator',
    'Field Worker',
    'Administrator'
  ];

  const languagesList: { code: Language; label: string }[] = [
    { code: 'EN', label: 'English' },
    { code: 'HI', label: 'हिंदी (Hindi)' },
    { code: 'AS', label: 'অসমীয়া (Assamese)' },
    { code: 'BN', label: 'বাংলা (Bengali)' },
    { code: 'MNI', label: 'মৈতৈলোন্ (Manipuri)' },
    { code: 'KHA', label: 'Khasi' },
    { code: 'MIZO', label: 'Mizo' },
    { code: 'NEP', label: 'नेपाली (Nepali)' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md select-none font-sans">
      <div className="max-w-[1920px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setCurrentScreen('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 border border-teal-400/40 flex items-center justify-center shadow-lg font-black text-white text-lg tracking-tighter group-hover:scale-105 transition-transform">
              NL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                  NER-LINK AI
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-700/60">
                  NORDIC TEAL
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium hidden md:block">
                North Eastern Region Logistics & Accessibility Network
              </p>
            </div>
          </div>
        </div>

        {/* Center: District Command & Live Stream Ticker */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Live Telemetry Ticker Badge */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isLiveStreaming
                ? 'bg-teal-950/90 border-teal-600 text-teal-300 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Live Telematics WebSocket Stream"
          >
            <Activity className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-pulse text-teal-400' : ''}`} />
            <span>{isLiveStreaming ? 'LIVE TELEMETRY ACTIVE (60Hz)' : 'STREAM PAUSED'}</span>
          </button>

          {/* District Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDistrictMenuOpen(!isDistrictMenuOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
            >
              <span className="text-slate-400 font-normal">District:</span>
              <span className="text-teal-300 font-bold">{activeDistrict}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDistrictMenuOpen && (
              <div className="absolute top-full mt-1.5 left-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Select Active Command District
                </div>
                {districtsList.map(dist => (
                  <button
                    key={dist}
                    onClick={() => {
                      setActiveDistrict(dist.replace(' District', ''));
                      setIsDistrictMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center justify-between transition-colors ${
                      activeDistrict === dist || dist.startsWith(activeDistrict)
                        ? 'bg-teal-950 text-teal-300 font-bold'
                        : 'text-slate-200'
                    }`}
                  >
                    <span>{dist}</span>
                    {(activeDistrict === dist || dist.startsWith(activeDistrict)) && (
                      <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* AI Copilot Launcher */}
          {onOpenAiCopilot && (
            <button
              onClick={onOpenAiCopilot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Bot className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">NER AI Assistant</span>
            </button>
          )}

          {/* SMS Terminal Launcher */}
          <button
            onClick={() => setIsSmsModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
            title="Open SMS Terminal Gateway"
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden xl:inline">SMS Gateway</span>
          </button>

          {/* Online / Offline Simulator Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isOnline
                ? 'bg-teal-950/80 border-teal-600 text-teal-300'
                : 'bg-rose-950/90 border-rose-600 text-rose-300 animate-pulse'
            }`}
            title="Toggle network connectivity"
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block"></span>
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Offline</span>
              </>
            )}
          </button>

          {/* Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => setIsAlertsDropdownOpen(!isAlertsDropdownOpen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-[10px] font-bold text-slate-950 rounded-full flex items-center justify-center border border-slate-900 animate-bounce">
                  {criticalCount}
                </span>
              )}
            </button>

            {isAlertsDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1 flex items-center justify-between border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">Active Disruptions ({unresolvedAlerts.length})</span>
                  <button
                    onClick={() => {
                      setCurrentScreen('alerts');
                      setIsAlertsDropdownOpen(false);
                    }}
                    className="text-[11px] text-teal-400 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800">
                  {unresolvedAlerts.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">All corridors operating normally.</div>
                  ) : (
                    unresolvedAlerts.map(alert => (
                      <div
                        key={alert.id}
                        onClick={() => {
                          setCurrentScreen('alerts');
                          setIsAlertsDropdownOpen(false);
                        }}
                        className="p-2.5 hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${alert.severity === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                          <span className="text-xs font-bold text-slate-100 truncate">{alert.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{alert.cause}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Select Language (8 Languages)
                </div>
                {languagesList.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 flex items-center justify-between ${
                      language === l.code ? 'bg-teal-950 text-teal-300 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <CheckCircle className="w-3 h-3 text-teal-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-[10px] font-extrabold text-white">
                {currentRole.slice(0, 1)}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="block text-[11px] font-bold text-slate-200">{currentRole}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Switch Active Role
                </div>
                {rolesList.map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center justify-between ${
                      currentRole === role ? 'bg-teal-950 text-teal-300 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <span>{role}</span>
                    {currentRole === role && <CheckCircle className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                ))}
                <div className="border-t border-slate-800 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setCurrentScreen('settings');
                      setIsRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      setCurrentScreen('login');
                      setIsRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-slate-800"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
