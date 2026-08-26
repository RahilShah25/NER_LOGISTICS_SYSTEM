import React, { useState } from 'react';
import { useLogistics } from './context/LogisticsContext';

// Navigation Components
import { TopNavBar } from './components/common/TopNavBar';
import { Sidebar } from './components/common/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { SmsSimulatorModal } from './components/common/SmsSimulatorModal';
import { AiCopilotDrawer } from './components/common/AiCopilotDrawer';

// Screens
import { LandingScreen } from './components/screens/LandingScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { DistrictDashboard } from './components/screens/DistrictDashboard';
import { StateCommandDashboard } from './components/screens/StateCommandDashboard';
import { LiveMapScreen } from './components/screens/LiveMapScreen';
import { DisruptionPredictionScreen } from './components/screens/DisruptionPredictionScreen';
import { WeatherIntelligenceScreen } from './components/screens/WeatherIntelligenceScreen';
import { VehiclesScreen } from './components/screens/VehiclesScreen';
import { EmergencyCommandScreen } from './components/screens/EmergencyCommandScreen';
import { InfrastructureScreen } from './components/screens/InfrastructureScreen';
import { IntegrationsScreen } from './components/screens/IntegrationsScreen';
import { AuditLogsScreen } from './components/screens/AuditLogsScreen';
import { RoadsCorridorsScreen } from './components/screens/RoadsCorridorsScreen';
import { RoadDetailScreen } from './components/screens/RoadDetailScreen';
import { IncidentsScreen } from './components/screens/IncidentsScreen';
import { IncidentDetailScreen } from './components/screens/IncidentDetailScreen';
import { RoutePlannerScreen } from './components/screens/RoutePlannerScreen';
import { ShipmentsScreen } from './components/screens/ShipmentsScreen';
import { ShipmentDetailScreen } from './components/screens/ShipmentDetailScreen';
import { AlertsTriageScreen } from './components/screens/AlertsTriageScreen';
import { EscalationCenterScreen } from './components/screens/EscalationCenterScreen';
import { FieldReportMobileScreen } from './components/screens/FieldReportMobileScreen';
import { OfflineSyncQueueScreen } from './components/screens/OfflineSyncQueueScreen';
import { SmsIvrHelpScreen } from './components/screens/SmsIvrHelpScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { UserProfileScreen } from './components/screens/UserProfileScreen';

// Toast Notification Icons
import { CheckCircle2, AlertTriangle, ShieldAlert, Info, X } from 'lucide-react';

export const App: React.FC = () => {
  const { currentScreen, toast, dismissToast } = useLogistics();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);

  // Landing Page
  if (currentScreen === 'landing') {
    return <LandingScreen />;
  }

  // Login Screen
  if (currentScreen === 'login') {
    return <LoginScreen />;
  }

  // Active Screen Renderer
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DistrictDashboard />;
      case 'state-command':
        return <StateCommandDashboard />;
      case 'map':
        return <LiveMapScreen />;
      case 'disruptions':
        return <DisruptionPredictionScreen />;
      case 'weather':
        return <WeatherIntelligenceScreen />;
      case 'vehicles':
        return <VehiclesScreen />;
      case 'emergency':
        return <EmergencyCommandScreen />;
      case 'infrastructure':
        return <InfrastructureScreen />;
      case 'integrations':
        return <IntegrationsScreen />;
      case 'audit-logs':
        return <AuditLogsScreen />;
      case 'roads':
        return <RoadsCorridorsScreen />;
      case 'road-detail':
        return <RoadDetailScreen />;
      case 'incidents':
        return <IncidentsScreen />;
      case 'incident-detail':
        return <IncidentDetailScreen />;
      case 'route-planner':
        return <RoutePlannerScreen />;
      case 'shipments':
        return <ShipmentsScreen />;
      case 'shipment-detail':
        return <ShipmentDetailScreen />;
      case 'alerts':
        return <AlertsTriageScreen />;
      case 'escalations':
        return <EscalationCenterScreen />;
      case 'field-report':
        return <FieldReportMobileScreen />;
      case 'offline-queue':
        return <OfflineSyncQueueScreen />;
      case 'sms-help':
        return <SmsIvrHelpScreen />;
      case 'districts':
        return <DistrictDashboard />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'admin':
        return <AdminScreen />;
      case 'settings':
      case 'profile':
        return <UserProfileScreen />;
      default:
        return <DistrictDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation Bar */}
      <TopNavBar onOpenAiCopilot={() => setIsAiCopilotOpen(true)} />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-950 pb-20 md:pb-6">
          <div className="flex-1 p-4 sm:p-6 max-w-[1920px] w-full mx-auto">
            {renderScreen()}
          </div>
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* SMS Terminal Modal */}
      <SmsSimulatorModal />

      {/* AI Copilot Assistant Drawer */}
      <AiCopilotDrawer
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-16 md:bottom-5 right-5 z-50 animate-slideUp">
          <div
            className={`p-4 rounded-xl shadow-2xl border flex items-start gap-3 max-w-md ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-950 text-white border-rose-600'
                : toast.type === 'warning'
                ? 'bg-amber-950 text-white border-amber-500'
                : 'bg-slate-900 text-white border-blue-500'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <ShieldAlert className="w-5 h-5 text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 text-xs">
              <div className="font-bold text-white text-sm">{toast.title}</div>
              <div className="text-slate-300 mt-0.5 leading-snug">{toast.desc}</div>
            </div>

            <button
              onClick={dismissToast}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
