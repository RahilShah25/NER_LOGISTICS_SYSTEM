import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLogistics } from './LogisticsContext';

export interface DemoStep {
  stepNumber: number;
  title: string;
  shortDesc: string;
  actionGuide: string;
  recommendedScreen: string;
  targetRoadCode?: string;
  targetShipmentId?: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 0,
    title: "Initial Baseline State",
    shortDesc: "All major corridors are OPEN and active shipments are in transit.",
    actionGuide: "Verify KPI counters and green operational map.",
    recommendedScreen: "dashboard"
  },
  {
    stepNumber: 1,
    title: "Step 1: Emergency SMS Command",
    shortDesc: "Field worker / Patrol sends SMS: 'ROAD DIM-KOH-01 BLOCKED'",
    actionGuide: "Open SMS terminal or click 'Send Block Command' to simulate low-connectivity input.",
    recommendedScreen: "dashboard",
    targetRoadCode: "DIM-KOH-01"
  },
  {
    stepNumber: 2,
    title: "Step 2: Road Status → BLOCKED (Red)",
    shortDesc: "Corridor DIM-KOH-01 status switches from OPEN to BLOCKED on Map and Grid.",
    actionGuide: "Observe live map turn Red and Risk Score spike to 91/100.",
    recommendedScreen: "roads",
    targetRoadCode: "DIM-KOH-01"
  },
  {
    stepNumber: 3,
    title: "Step 3: Critical Alert Generated",
    shortDesc: "High-priority operational alert: 'Dimapur–Kohima corridor blocked'.",
    actionGuide: "Review Critical Alert Drawer on Dashboard and Alerts triage screen.",
    recommendedScreen: "alerts"
  },
  {
    stepNumber: 4,
    title: "Step 4: Affected Shipments Identified",
    shortDesc: "Decision Layer detects Emergency Medicine shipment NER-MED-102 enroute to Kohima.",
    actionGuide: "View affected shipments in Road Detail and Shipments list.",
    recommendedScreen: "road-detail",
    targetRoadCode: "DIM-KOH-01",
    targetShipmentId: "NER-MED-102"
  },
  {
    stepNumber: 5,
    title: "Step 5: Automated Cargo-Aware Rerouting",
    shortDesc: "System computes bypass: Dimapur → Wokha → Kohima (DIM-WOK + KOH-WOK).",
    actionGuide: "Examine Route Planner showing risk avoidance preference for Medicine cargo.",
    recommendedScreen: "route-planner"
  },
  {
    stepNumber: 6,
    title: "Step 6: Shipment Status → REROUTED",
    shortDesc: "NER-MED-102 state transitions from 'IN TRANSIT' to 'REROUTED'.",
    actionGuide: "Inspect Shipment Operations table showing updated Rerouted badge.",
    recommendedScreen: "shipments",
    targetShipmentId: "NER-MED-102"
  },
  {
    stepNumber: 7,
    title: "Step 7: ETA Recalculation (18:20 → 18:45)",
    shortDesc: "ETA updated to 18:45 (+25 min delay) with live map path update.",
    actionGuide: "Open Shipment Detail to see live rerouted telemetry & ETA delta.",
    recommendedScreen: "shipment-detail",
    targetShipmentId: "NER-MED-102"
  },
  {
    stepNumber: 8,
    title: "Step 8: Driver & Operator Dispatch Notification",
    shortDesc: "Automated SMS/In-cab dispatch sent to driver Rajesh Gogoi.",
    actionGuide: "Verify the driver notification timeline in Shipment Detail.",
    recommendedScreen: "shipment-detail",
    targetShipmentId: "NER-MED-102"
  },
  {
    stepNumber: 9,
    title: "Step 9: Offline Field Report Submission",
    shortDesc: "Field worker encounters rockfall in zero-connectivity zone and saves report offline.",
    actionGuide: "Toggle Offline mode, fill Mobile Field Report, and check Offline Queue.",
    recommendedScreen: "field-report"
  },
  {
    stepNumber: 10,
    title: "Step 10: Connectivity Restored & Auto-Sync",
    shortDesc: "Field device reconnects; pending reports automatically push to Command Center.",
    actionGuide: "Click 'Sync Now' in Offline Queue to see status turn Synced ✓.",
    recommendedScreen: "offline-queue"
  },
  {
    stepNumber: 11,
    title: "Step 11: District Connectivity Summary",
    shortDesc: "State and District commands display aggregated operational connectivity index.",
    actionGuide: "Review State Command Dashboard and Analytics Intelligence.",
    recommendedScreen: "state-command"
  }
];

interface DemoWalkthroughContextType {
  isDemoActive: boolean;
  currentStepIndex: number;
  currentStep: DemoStep;
  startDemo: () => void;
  stopDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  executeCurrentStepAction: () => void;
}

const DemoWalkthroughContext = createContext<DemoWalkthroughContextType | undefined>(undefined);

export const DemoWalkthroughProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const {
    setCurrentScreen,
    setSelectedRoadId,
    setSelectedShipmentId,
    resetToInitialDemoState,
    updateRoadStatus,
    setIsOnline,
    syncOfflineReports,
    showToast
  } = useLogistics();

  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];

  const startDemo = () => {
    setIsDemoActive(true);
    setCurrentStepIndex(0);
    resetToInitialDemoState();
    setCurrentScreen('dashboard');
    showToast('info', 'SIH 2026 Interactive Demo Started', 'Starting step-by-step evaluation workflow.');
  };

  const stopDemo = () => {
    setIsDemoActive(false);
  };

  const executeCurrentStepAction = () => {
    switch (currentStepIndex) {
      case 0:
        resetToInitialDemoState();
        setCurrentScreen('dashboard');
        break;
      case 1:
        // Trigger SMS Road Block
        updateRoadStatus('DIM-KOH-01', 'BLOCKED', 'Reported via SMS: Landslide at Paglapahar KM 42');
        setSelectedRoadId('DIM-KOH-01');
        setCurrentScreen('dashboard');
        break;
      case 2:
        setSelectedRoadId('DIM-KOH-01');
        setCurrentScreen('roads');
        break;
      case 3:
        setCurrentScreen('alerts');
        break;
      case 4:
        setSelectedRoadId('DIM-KOH-01');
        setSelectedShipmentId('NER-MED-102');
        setCurrentScreen('road-detail');
        break;
      case 5:
        setCurrentScreen('route-planner');
        break;
      case 6:
        setSelectedShipmentId('NER-MED-102');
        setCurrentScreen('shipments');
        break;
      case 7:
      case 8:
        setSelectedShipmentId('NER-MED-102');
        setCurrentScreen('shipment-detail');
        break;
      case 9:
        setIsOnline(false);
        setCurrentScreen('field-report');
        break;
      case 10:
        setIsOnline(true);
        syncOfflineReports();
        setCurrentScreen('offline-queue');
        break;
      case 11:
        setCurrentScreen('state-command');
        break;
    }
  };

  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(index, DEMO_STEPS.length - 1));
    setCurrentStepIndex(clamped);
    const target = DEMO_STEPS[clamped];
    if (target.recommendedScreen) {
      setCurrentScreen(target.recommendedScreen);
    }
    if (target.targetRoadCode) {
      setSelectedRoadId(target.targetRoadCode);
    }
    if (target.targetShipmentId) {
      setSelectedShipmentId(target.targetShipmentId);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      goToStep(nextIdx);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  return (
    <DemoWalkthroughContext.Provider
      value={{
        isDemoActive,
        currentStepIndex,
        currentStep,
        startDemo,
        stopDemo,
        nextStep,
        prevStep,
        goToStep,
        executeCurrentStepAction
      }}
    >
      {children}
    </DemoWalkthroughContext.Provider>
  );
};

export const useDemoWalkthrough = () => {
  const context = useContext(DemoWalkthroughContext);
  if (!context) {
    throw new Error('useDemoWalkthrough must be used within DemoWalkthroughProvider');
  }
  return context;
};
