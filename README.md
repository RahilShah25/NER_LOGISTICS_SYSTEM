# NER-LINK AI
### North Eastern Region Logistics & Accessibility Intelligence Network
> **“See the disruption. Predict the risk. Optimize the route. Deliver without interruption.”**

![NER-LINK AI Portal](https://img.shields.io/badge/SIH%202026-Logistics%20Decision%20Layer-0d9488?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/React%2018-TypeScript%20%7C%20Vite%20%7C%20Leaflet-0f172a?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-10b981?style=for-the-badge)

---

## 📌 Executive Summary

**NER-LINK AI** is an AI-native logistics nervous system and decision-support infrastructure engineered specifically for the complex hill terrain challenges of the North Eastern Region of India (Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura, Sikkim).

Unlike traditional reactive GPS dashboards, **NER-LINK AI** predicts landslide, flood, and road cavitation risks up to 7 days before physical blockage occurs. Upon hazard detection, the platform automatically triggers cargo-aware alternate routing (e.g., bypassing blocked NH-29 Paglapahar via Wokha / Silchar) to protect temperature-sensitive pharmaceuticals, vaccines, and emergency relief supplies.

---

## ✨ Key USPs & Differentiators

1. **Predictive ML (Accessibility Risk Index)**:
   - Evaluates real-time 24-hr IMD rainfall intensity ($\text{mm/hr}$), NESAC satellite soil moisture, ISRO Bhoonidhi DEM slope gradients ($0^\circ - 60^\circ$), and 5-year historical closure frequency to output a unified **0-100 Risk Index** per corridor segment.
2. **Offline-First PWA Architecture**:
   - Field officer mobile reporting app operates seamlessly in zero-cellular dead zones using local device storage (IndexedDB / PWA SQLite cache) and automatically synchronizes when network connectivity returns.
3. **Multilingual Voice Incident Reporting**:
   - Supports voice-based hazard reporting in 8 regional languages (*Assamese, Bodo, Khasi, Manipuri, Nagamese, Hindi, Mizo, Nepali*) with real-time speech-to-text transcription for low-literacy field officers.
4. **Real Leaflet GIS Engine & Isochrones**:
   - Real OpenStreetMap GIS canvas featuring 30-min, 60-min, and 120-min emergency response reachability circles centered on major supply hubs (Guwahati, Dimapur, Silchar).
5. **Google OR-Tools CVRP Multi-Stop Optimization**:
   - Capacitated Vehicle Routing Problem (CVRP) solver optimizing multi-stop waypoint drop sequences under vehicle payload weight capacity constraints (12.0 Tons) and time windows.
6. **Fleetbase & ERPNext Fleet Telematics**:
   - Live 60Hz WebSocket vehicle telematics streaming speed, fuel consumption (%), engine temperature, cold-chain storage temperature (°C), and remote driver dispatch push notifications.
7. **Disaster Emergency Command Mode**:
   - Dedicated disaster mobilization center for instant emergency declarations, NDRF heavy earthmover dispatch, hospital oxygen reserve monitoring, and relief shelter tracking.

---

## 🏗️ 4-Layer System Architecture

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             PRESENTATION LAYER                                   │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌──────────────────┐  │
│  │ React Command Dashboard │  │ Mobile PWA Field App    │  │ SMS / IVR        │  │
│  │ (Govt / Operator Desk)  │  │ (Offline Local Storage) │  │ Terminal Gateway │  │
│  └────────────┬────────────┘  └────────────┬────────────┘  └────────┬─────────┘  │
├───────────────┼────────────────────────────┼────────────────────────┼────────────┤
│               │             CORE PLATFORM LAYER                     │            │
│  ┌────────────┴────────────┐  ┌────────────┴────────────┐  ┌────────┴─────────┐  │
│  │ GraphQL / REST API      │  │ Socket.io WebSockets    │  │ SQLite / PWA     │  │
│  │ (FastAPI / Express)     │  │ (60Hz Telematics Stream)│  │ Offline Queue    │  │
│  └────────────┬────────────┘  └────────────┬────────────┘  └────────┬─────────┘  │
├───────────────┼────────────────────────────┼────────────────────────┼────────────┤
│               │           AI & PROCESSING LAYER                     │            │
│  ┌────────────┴────────────┐  ┌────────────┴────────────┐  ┌────────┴─────────┐  │
│  │ XGBoost ML Risk Engine  │  │ Google OR-Tools CVRP    │  │ OSRM / NetworkX  │  │
│  │ (Accessibility Risk)    │  │ (Multi-Stop Optimizer)  │  │ Graph Pathfinder │  │
│  └────────────┬────────────┘  └────────────┬────────────┘  └────────┬─────────┘  │
├───────────────┼────────────────────────────┼────────────────────────┼────────────┤
│               │             DATA INGESTION LAYER                    │            │
│  ┌────────────┴────────────┐  ┌────────────┴────────────┐  ┌────────┴─────────┐  │
│  │ IMD / Weather API Feed  │  │ ISRO Bhoonidhi DEM      │  │ PostGIS Spatial  │  │
│  │ (Rainfall & Moisture)   │  │ (Elevation & Slope Data)│  │ Geospatial DB    │  │
│  └─────────────────────────┘  └─────────────────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Nordic Teal & Slate theme), Lucide Icons
- **GIS Mapping**: Leaflet GIS Engine (`leaflet`, `@types/leaflet`), OpenStreetMap CartoDB basemaps, OpenRouteService Isochrones
- **Analytics & Data Vis**: Recharts
- **State Management**: React Context (`LogisticsContext.tsx`) with localStorage persistence and WebSocket simulator

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/RahilShah25/NER_LOGISTICS_SYSTEM.git
   cd NER_LOGISTICS_SYSTEM
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000** in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
NER_LOGISTICS_SYSTEM/
├── src/
│   ├── components/
│   │   ├── common/             # TopNavBar, Sidebar, MobileBottomNav, AiCopilotDrawer, KpiCard, StatusBadge
│   │   ├── map/                # NortheastIndiaMap (Leaflet GIS Engine)
│   │   ├── modals/             # BlockRoadModal, EscalateModal, CreateShipmentModal, RouteAssignModal, SmsSimulatorModal
│   │   └── screens/            # 21 Production Screens (Dashboard, Live Map, Disruption AI, Vehicles, Emergency, etc.)
│   ├── context/
│   │   └── LogisticsContext.tsx # Central State & WebSocket Telematics Ticker Engine
│   ├── data/
│   │   ├── initialData.ts      # WGS84 Geographic Data for 14 Cities, 15 Corridors, Telematics & Assets
│   │   └── translations.ts     # Multilingual Dictionary (EN, HI, AS, BN, MNI, KHA, MIZO, NEP)
│   ├── types/
│   │   └── index.ts            # TypeScript Data Models & Interfaces
│   ├── App.tsx                 # Core Router & Layout Viewport
│   ├── index.css               # Tailwind CSS & Nordic Teal Theme Overrides
│   └── main.tsx                # React Root Entrypoint
├── index.html                  # Main HTML Template & Leaflet Stylesheet
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---


**GitHub Repository**: [https://github.com/RahilShah25/NER_LOGISTICS_SYSTEM.git](https://github.com/RahilShah25/NER_LOGISTICS_SYSTEM.git)
