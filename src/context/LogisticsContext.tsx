import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Road,
  Shipment,
  Incident,
  AlertItem,
  OfflineReport,
  UserRole,
  Language,
  DeviceView,
  RiskWeights,
  RoadStatus,
  CargoType,
  ShipmentPriority
} from '../types';
import {
  INITIAL_ROADS,
  INITIAL_SHIPMENTS,
  INITIAL_INCIDENTS,
  INITIAL_ALERTS,
  INITIAL_OFFLINE_REPORTS
} from '../data/initialData';
import { TRANSLATIONS } from '../data/translations';

export interface ToastData {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  desc: string;
}

interface LogisticsContextType {
  roads: Road[];
  shipments: Shipment[];
  incidents: Incident[];
  alerts: AlertItem[];
  offlineReports: OfflineReport[];
  isOnline: boolean;
  activeDistrict: string;
  activeState: string;
  currentRole: UserRole;
  language: Language;
  deviceView: DeviceView;
  riskWeights: RiskWeights;
  currentScreen: string;
  selectedRoadId: string | null;
  selectedShipmentId: string | null;
  selectedIncidentId: string | null;
  isSmsModalOpen: boolean;
  isLiveStreaming: boolean;
  telemetryTicks: number;
  toast: ToastData | null;
  t: typeof TRANSLATIONS.EN;

  // Setters & Navigation
  setIsOnline: (val: boolean) => void;
  setActiveDistrict: (district: string) => void;
  setCurrentRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  setDeviceView: (view: DeviceView) => void;
  setRiskWeights: (weights: RiskWeights) => void;
  setCurrentScreen: (screen: string) => void;
  setSelectedRoadId: (id: string | null) => void;
  setSelectedShipmentId: (id: string | null) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setIsSmsModalOpen: (val: boolean) => void;
  setIsLiveStreaming: (val: boolean) => void;
  showToast: (type: ToastData['type'], title: string, desc: string) => void;
  dismissToast: () => void;


  // Business Actions
  updateRoadStatus: (roadId: string, status: RoadStatus, notes?: string, reporter?: string) => void;
  rerouteShipment: (shipmentId: string, newRoute: string[], newEta: string, delayMins: number, reason: string) => void;
  createShipment: (newShipment: Omit<Shipment, 'id' | 'timeline' | 'delayMinutes'>) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'createdTime' | 'timeline'>) => string;
  acknowledgeIncident: (id: string) => void;
  resolveIncident: (id: string) => void;
  escalateIncident: (id: string, targetLevel: 'District' | 'State', note: string) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  escalateAlert: (id: string) => void;
  addOfflineReport: (report: Omit<OfflineReport, 'id' | 'createdAt' | 'syncStatus'>) => void;
  syncOfflineReports: () => void;
  clearOfflineQueue: () => void;
  processSmsCommand: (command: string) => { success: boolean; response: string };
  resetToInitialDemoState: () => void;
  triggerRoadBlockDemo: (roadCode?: string) => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export const LogisticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roads, setRoads] = useState<Road[]>(() => {
    const saved = localStorage.getItem('ner_roads');
    return saved ? JSON.parse(saved) : INITIAL_ROADS;
  });

  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem('ner_shipments');
    return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('ner_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    const saved = localStorage.getItem('ner_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [offlineReports, setOfflineReports] = useState<OfflineReport[]>(() => {
    const saved = localStorage.getItem('ner_offline_reports');
    return saved ? JSON.parse(saved) : INITIAL_OFFLINE_REPORTS;
  });

  const [isOnline, setIsOnlineState] = useState<boolean>(true);
  const [activeDistrict, setActiveDistrict] = useState<string>('Dimapur');
  const [activeState, setActiveState] = useState<string>('Nagaland');
  const [currentRole, setCurrentRole] = useState<UserRole>('District Officer');
  const [language, setLanguage] = useState<Language>('EN');
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [riskWeights, setRiskWeights] = useState<RiskWeights>({ rainfall: 45, historical: 35, terrain: 20 });
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>('DIM-KOH-01');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>('NER-MED-102');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('INC-0091');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState<boolean>(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [telemetryTicks, setTelemetryTicks] = useState<number>(0);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Live WebSocket Telematics Ticker (Updates vehicle progress every 1.5s)
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setTelemetryTicks(prev => prev + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);


  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ner_roads', JSON.stringify(roads));
  }, [roads]);

  useEffect(() => {
    localStorage.setItem('ner_shipments', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('ner_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('ner_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('ner_offline_reports', JSON.stringify(offlineReports));
  }, [offlineReports]);

  const showToast = (type: ToastData['type'], title: string, desc: string) => {
    const id = Date.now().toString();
    setToast({ id, type, title, desc });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const dismissToast = () => setToast(null);

  const setIsOnline = (val: boolean) => {
    setIsOnlineState(val);
    if (val) {
      showToast('success', 'Network Restored', 'Back online. Ready to synchronize pending field reports.');
    } else {
      showToast('warning', 'Offline Mode Activated', 'Operating with cached offline data. Submissions will queue locally.');
    }
  };

  // Road status updates
  const updateRoadStatus = (roadId: string, status: RoadStatus, notes?: string, reporter?: string) => {
    setRoads(prev =>
      prev.map(road => {
        if (road.id === roadId) {
          const newRiskScore = status === 'BLOCKED' ? 91 : status === 'RESTRICTED' ? 67 : status === 'HIGH_RISK' ? 74 : 18;
          return {
            ...road,
            status,
            riskScore: newRiskScore,
            rainfallScore: status === 'BLOCKED' ? 42 : status === 'RESTRICTED' ? 32 : 10,
            rainfallLevel: status === 'BLOCKED' ? 'Severe' : status === 'RESTRICTED' ? 'High' : 'Low',
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
            notes: notes || road.notes,
            reporter: reporter || road.reporter
          };
        }
        return road;
      })
    );

    // If a road is BLOCKED, automatically identify affected shipments and auto-reroute them!
    if (status === 'BLOCKED') {
      const affectedShipments = shipments.filter(s => s.originalRoute.includes(roadId) && s.status !== 'DELIVERED');
      
      if (affectedShipments.length > 0) {
        setShipments(prev =>
          prev.map(s => {
            if (s.originalRoute.includes(roadId) && s.status !== 'DELIVERED') {
              // Reroute via Wokha
              const altRoute = ['DIM-WOK-00', 'KOH-WOK-02'];
              const updatedTimeline = [
                ...s.timeline,
                {
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
                  event: `Corridor ${roadId} BLOCKED. Automatic Cargo-Aware Rerouting assigned alternate route via Wokha.`,
                  type: 'alert' as const
                },
                {
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
                  event: `Driver ${s.driverName} notified. Updated ETA to 18:45 (+25m).`,
                  type: 'success' as const
                }
              ];
              return {
                ...s,
                status: 'REROUTED',
                activeRoute: altRoute,
                updatedEta: '18:45 IST',
                delayMinutes: 25,
                currentCorridor: 'DIM-WOK-00 (Enroute via Wokha)',
                rerouteReason: `${roadId} Blocked. Automated reroute via Wokha Bypass to protect priority cargo.`,
                timeline: updatedTimeline
              };
            }
            return s;
          })
        );

        // Add Critical Alert
        const newAlert: AlertItem = {
          id: `ALT-${Date.now().toString().slice(-4)}`,
          severity: 'Critical',
          title: `${roadId} Corridor Blocked - ${affectedShipments.length} Shipments Rerouted`,
          location: roadId,
          roadCode: roadId,
          cause: notes || 'Corridor blockage reported',
          affectedShipmentsCount: affectedShipments.length,
          createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
          escalationLevel: 'District',
          isAcknowledged: false,
          isResolved: false
        };
        setAlerts(prev => [newAlert, ...prev]);

        showToast(
          'error',
          `Road ${roadId} Blocked`,
          `Status changed to BLOCKED. ${affectedShipments.length} active shipment(s) automatically rerouted.`
        );
      } else {
        showToast('warning', `Road ${roadId} Status Updated`, `Status changed to ${status}.`);
      }
    } else {
      showToast('success', `Road ${roadId} Status Updated`, `Status changed to ${status}.`);
    }
  };

  // Shipment Actions
  const rerouteShipment = (
    shipmentId: string,
    newRoute: string[],
    newEta: string,
    delayMins: number,
    reason: string
  ) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'REROUTED',
            activeRoute: newRoute,
            updatedEta: newEta,
            delayMinutes: delayMins,
            rerouteReason: reason,
            timeline: [
              ...s.timeline,
              {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
                event: `Reroute confirmed: ${reason}. Updated ETA: ${newEta}.`,
                type: 'warning'
              }
            ]
          };
        }
        return s;
      })
    );
    showToast('success', `Shipment ${shipmentId} Rerouted`, `Assigned alternate route. New ETA: ${newEta}`);
  };

  const createShipment = (data: Omit<Shipment, 'id' | 'timeline' | 'delayMinutes'>) => {
    const newId = `NER-${data.cargoType.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newShipment: Shipment = {
      ...data,
      id: newId,
      delayMinutes: 0,
      timeline: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
          event: `Shipment registered and dispatched from ${data.origin} to ${data.destination}.`,
          type: 'info'
        }
      ]
    };
    setShipments(prev => [newShipment, ...prev]);
    showToast('success', 'Shipment Created', `${newId} (${data.cargo}) dispatched on assigned corridor.`);
  };

  // Incident Actions
  const addIncident = (incidentData: Omit<Incident, 'id' | 'createdTime' | 'timeline'>): string => {
    const newId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const newIncident: Incident = {
      ...incidentData,
      id: newId,
      createdTime: timeNow,
      timeline: [
        {
          time: timeNow,
          stage: 'Report Submitted',
          actor: incidentData.reporter,
          note: incidentData.description
        }
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);

    // If Critical, block road and trigger alert
    if (incidentData.severity === 'Critical') {
      updateRoadStatus(incidentData.roadCode, 'BLOCKED', incidentData.description, incidentData.reporter);
    }

    showToast('warning', 'Incident Recorded', `${newId} [${incidentData.type}] filed for ${incidentData.roadCode}.`);
    return newId;
  };

  const acknowledgeIncident = (id: string) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === id) {
          return {
            ...inc,
            status: 'Acknowledged',
            timeline: [
              ...inc.timeline,
              {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
                stage: 'Acknowledged',
                actor: `${currentRole} (${activeDistrict})`,
                note: 'Incident acknowledged. Safety protocol initiated.'
              }
            ]
          };
        }
        return inc;
      })
    );
    showToast('info', 'Incident Acknowledged', `${id} marked acknowledged.`);
  };

  const resolveIncident = (id: string) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === id) {
          // Open road back up if this incident caused blockage
          updateRoadStatus(inc.roadCode, 'OPEN', 'Blockage cleared by PWD / NDRF teams.', 'Incident Resolved');
          return {
            ...inc,
            status: 'Resolved',
            timeline: [
              ...inc.timeline,
              {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
                stage: 'Resolved',
                actor: `${currentRole} (${activeDistrict})`,
                note: 'Debris cleared. Road certified accessible.'
              }
            ]
          };
        }
        return inc;
      })
    );
    showToast('success', 'Incident Resolved', `${id} resolved and corridor reopened.`);
  };

  const escalateIncident = (id: string, targetLevel: 'District' | 'State', note: string) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === id) {
          return {
            ...inc,
            status: 'Escalated',
            timeline: [
              ...inc.timeline,
              {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
                stage: `Escalated to ${targetLevel}`,
                actor: `${currentRole} (${activeDistrict})`,
                note: note || 'Escalated for immediate regional disaster support and heavy machinery deployment.'
              }
            ]
          };
        }
        return inc;
      })
    );
    showToast('error', 'Incident Escalated', `${id} escalated to ${targetLevel} Command.`);
  };

  // Alerts
  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, isAcknowledged: true } : a)));
    showToast('info', 'Alert Acknowledged', 'Disruption alert acknowledged by operations desk.');
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, isResolved: true } : a)));
    showToast('success', 'Alert Resolved', 'Alert marked resolved.');
  };

  const escalateAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, escalationLevel: 'State', isAcknowledged: true } : a))
    );
    showToast('error', 'Alert Escalated', 'Alert escalated to State Regional Command.');
  };

  // Offline field queue
  const addOfflineReport = (reportData: Omit<OfflineReport, 'id' | 'createdAt' | 'syncStatus'>) => {
    const newReport: OfflineReport = {
      ...reportData,
      id: `INC-LOCAL-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      syncStatus: isOnline ? 'synced' : 'pending'
    };

    setOfflineReports(prev => [newReport, ...prev]);

    if (isOnline) {
      addIncident({
        type: reportData.incidentType,
        severity: reportData.severity,
        location: reportData.location,
        roadCode: reportData.roadCode,
        district: activeDistrict,
        state: activeState,
        coordinates: '25.8642° N, 93.7511° E',
        reporter: 'Field Officer (Online Submission)',
        reporterRole: 'Road Safety Unit',
        description: reportData.description,
        status: 'Unresolved',
        affectedShipmentIds: ['NER-MED-102'],
        recommendedAction: 'Verify road obstruction and dispatch clearance unit.'
      });
      showToast('success', 'Report Submitted', 'Live incident submitted and broadcast to district dashboard.');
    } else {
      showToast('warning', 'Report Saved Locally (Offline)', 'Offline mode: Report saved to local device cache. Will sync when online.');
    }
  };

  const syncOfflineReports = () => {
    setOfflineReports(prev =>
      prev.map(r => ({
        ...r,
        syncStatus: 'synced'
      }))
    );
    showToast('success', 'Sync Completed', 'All pending offline reports successfully pushed to State Command DB.');
  };

  const clearOfflineQueue = () => {
    setOfflineReports([]);
    showToast('info', 'Queue Cleared', 'Offline report queue cleared.');
  };

  // SMS command processor
  const processSmsCommand = (cmdText: string): { success: boolean; response: string } => {
    const raw = cmdText.trim();
    const parts = raw.split(/\s+/);
    if (parts.length === 0 || !raw) {
      return {
        success: false,
        response: 'ERR: Empty command. Supported formats: STATUS <ROAD_CODE>, ROAD <ROAD_CODE> BLOCKED, ROAD <ROAD_CODE> OPEN'
      };
    }

    const commandVerb = parts[0].toUpperCase();

    // 1. STATUS <ROAD_CODE>
    if (commandVerb === 'STATUS' && parts.length >= 2) {
      const code = parts[1].toUpperCase();
      const road = roads.find(r => r.id === code);
      if (!road) {
        return {
          success: false,
          response: `ERR: Road code ${code} not recognized in NER corridor registry.`
        };
      }
      return {
        success: true,
        response: `${road.id}\nSTATUS: ${road.status}\nRISK: ${road.riskScore}/100\nUPDATED: ${road.lastUpdated}\nNOTES: ${road.notes.slice(0, 75)}`
      };
    }

    // 2. ROAD <ROAD_CODE> <STATUS>
    if (commandVerb === 'ROAD' && parts.length >= 3) {
      const code = parts[1].toUpperCase();
      const statusArg = parts[2].toUpperCase();
      const road = roads.find(r => r.id === code);

      if (!road) {
        return {
          success: false,
          response: `ERR: Road code ${code} not found.`
        };
      }

      if (statusArg === 'BLOCKED') {
        updateRoadStatus(code, 'BLOCKED', 'Reported via SMS/IVR Gateway (Emergency Corridor Block)');
        return {
          success: true,
          response: `Road status updated.\nCritical alert created.\nAffected shipments will be rerouted.\nCorridor ${code} marked BLOCKED.`
        };
      } else if (statusArg === 'OPEN') {
        updateRoadStatus(code, 'OPEN', 'Corridor reopened via SMS command.');
        return {
          success: true,
          response: `Road status updated.\n${code} marked OPEN.\nNormal traffic restored.`
        };
      } else if (statusArg === 'RESTRICTED') {
        updateRoadStatus(code, 'RESTRICTED', 'Corridor restricted via SMS command.');
        return {
          success: true,
          response: `Road status updated.\n${code} marked RESTRICTED.\nRoute penalty applied.`
        };
      }
    }

    return {
      success: false,
      response: `ERR: Unrecognized SMS command "${raw}". Format: ROAD <CODE> BLOCKED | ROAD <CODE> OPEN | STATUS <CODE>`
    };
  };

  // Demo state reset
  const resetToInitialDemoState = () => {
    // Reset all roads to OPEN for clean initial state demo!
    const cleanRoads: Road[] = INITIAL_ROADS.map(r => ({
      ...r,
      status: r.id === 'DIM-KOH-01' ? 'OPEN' : r.id === 'SIL-IMP-04' ? 'RESTRICTED' : r.id === 'ITA-TAW-10' ? 'RESTRICTED' : 'OPEN',
      riskScore: r.id === 'DIM-KOH-01' ? 18 : r.riskScore,
      rainfallScore: r.id === 'DIM-KOH-01' ? 10 : r.rainfallScore,
      rainfallLevel: r.id === 'DIM-KOH-01' ? 'Low' : r.rainfallLevel,
      lastUpdated: '14:00 IST'
    }));

    const cleanShipments: Shipment[] = INITIAL_SHIPMENTS.map(s => {
      if (s.id === 'NER-MED-102') {
        return {
          ...s,
          status: 'IN TRANSIT',
          originalEta: '18:20 IST',
          updatedEta: '18:20 IST',
          delayMinutes: 0,
          currentCorridor: 'DIM-KOH-01 (Approaching Paglapahar)',
          activeRoute: ['DIM-KOH-01'],
          rerouteReason: undefined,
          timeline: [
            { time: '14:00 IST', event: 'Shipment dispatched from Dimapur Central Medical Depot', type: 'info' },
            { time: '14:20 IST', event: 'Approaching Dimapur Outpost Checkpoint KM 12', type: 'info' }
          ]
        };
      }
      return s;
    });

    const cleanAlerts = INITIAL_ALERTS.filter(a => a.id !== 'ALT-01' && a.id !== 'ALT-03');

    setRoads(cleanRoads);
    setShipments(cleanShipments);
    setAlerts(cleanAlerts);
    setIsOnlineState(true);
    setSelectedRoadId('DIM-KOH-01');
    setSelectedShipmentId('NER-MED-102');
    showToast('info', 'Demo State Reset', 'System returned to baseline initial state (all major corridors open).');
  };

  // Trigger Road Block Demo step directly
  const triggerRoadBlockDemo = (roadCode: string = 'DIM-KOH-01') => {
    updateRoadStatus(roadCode, 'BLOCKED', 'Landslide reported at Paglapahar KM 42+300. Pavement buried.');
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;

  return (
    <LogisticsContext.Provider
      value={{
        roads,
        shipments,
        incidents,
        alerts,
        offlineReports,
        isOnline,
        activeDistrict,
        activeState,
        currentRole,
        language,
        deviceView,
        riskWeights,
        currentScreen,
        selectedRoadId,
        selectedShipmentId,
        selectedIncidentId,
        isSmsModalOpen,
        isLiveStreaming,
        telemetryTicks,
        toast,
        t,
        setIsOnline,
        setActiveDistrict,
        setCurrentRole,
        setLanguage,
        setDeviceView,
        setRiskWeights,
        setCurrentScreen,
        setSelectedRoadId,
        setSelectedShipmentId,
        setSelectedIncidentId,
        setIsSmsModalOpen,
        setIsLiveStreaming,
        showToast,
        dismissToast,

        updateRoadStatus,
        rerouteShipment,
        createShipment,
        addIncident,
        acknowledgeIncident,
        resolveIncident,
        escalateIncident,
        acknowledgeAlert,
        resolveAlert,
        escalateAlert,
        addOfflineReport,
        syncOfflineReports,
        clearOfflineQueue,
        processSmsCommand,
        resetToInitialDemoState,
        triggerRoadBlockDemo
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};
