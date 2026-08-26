export type RoadStatus = 'OPEN' | 'RESTRICTED' | 'BLOCKED' | 'HIGH_RISK' | 'UNKNOWN';

export interface Road {
  id: string; // e.g. 'DIM-KOH-01'
  name: string; // e.g. 'Dimapur → Kohima'
  origin: string;
  destination: string;
  state: string;
  district: string;
  status: RoadStatus;
  riskScore: number; // 0 - 100
  rainfallScore: number; // e.g. 42 / 45
  historicalScore: number; // e.g. 31 / 35
  terrainScore: number; // e.g. 18 / 20
  rainfallLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  incidentsCount: number;
  lastUpdated: string;
  reporter: string;
  source: string;
  lengthKm: number;
  normalTravelTimeMins: number;
  notes: string;
  coordinates: [number, number][]; // [lon, lat] points for SVG mapping
}

export type CargoType =
  | 'Medicine'
  | 'Perishable Food'
  | 'Agricultural Produce'
  | 'Construction Material'
  | 'Liquid Oxygen'
  | 'General Freight';

export type ShipmentPriority = 'Emergency' | 'High' | 'Normal';

export type ShipmentStatus = 'IN TRANSIT' | 'REROUTED' | 'DELAYED' | 'DELIVERED' | 'PENDING';

export interface ShipmentTimelineEvent {
  time: string;
  event: string;
  type?: 'info' | 'warning' | 'alert' | 'success';
}

export interface Shipment {
  id: string; // e.g. 'NER-MED-102'
  cargo: string;
  cargoType: CargoType;
  priority: ShipmentPriority;
  origin: string;
  destination: string;
  vehicle: string;
  driverName: string;
  driverPhone: string;
  status: ShipmentStatus;
  originalEta: string;
  updatedEta: string;
  delayMinutes: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  currentCorridor: string;
  originalRoute: string[]; // array of road IDs
  activeRoute: string[]; // array of road IDs
  rerouteReason?: string;
  timeline: ShipmentTimelineEvent[];
}

export type IncidentType =
  | 'Landslide'
  | 'Flood'
  | 'Road Damage'
  | 'Bridge Damage'
  | 'Heavy Rainfall'
  | 'Connectivity Loss'
  | 'Other';

export type IncidentSeverity = 'Critical' | 'Warning' | 'Info';

export type IncidentStatus = 'Unresolved' | 'Acknowledged' | 'Resolved' | 'Escalated';

export interface IncidentTimelineEntry {
  time: string;
  stage: string;
  actor: string;
  note: string;
}

export interface Incident {
  id: string; // e.g. 'INC-0091'
  type: IncidentType;
  severity: IncidentSeverity;
  location: string;
  roadCode: string;
  district: string;
  state: string;
  coordinates: string;
  reporter: string;
  reporterRole: string;
  createdTime: string;
  description: string;
  photoUrl?: string;
  status: IncidentStatus;
  affectedShipmentIds: string[];
  recommendedAction: string;
  timeline: IncidentTimelineEntry[];
}

export interface AlertItem {
  id: string;
  severity: IncidentSeverity;
  title: string;
  location: string;
  roadCode: string;
  cause: string;
  affectedShipmentsCount: number;
  createdTime: string;
  escalationLevel: 'Field' | 'District' | 'State';
  isAcknowledged: boolean;
  isResolved: boolean;
}

export interface OfflineReport {
  id: string;
  roadCode: string;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  description: string;
  photoData?: string;
  location: string;
  createdAt: string;
  syncStatus: 'pending' | 'synced';
}

export type UserRole =
  | 'District Officer'
  | 'State Officer'
  | 'Logistics Operator'
  | 'Field Worker'
  | 'Administrator';

export type Language = 'EN' | 'HI' | 'AS' | 'BN' | 'MNI' | 'KHA' | 'MIZO' | 'NEP';

export type DeviceView = 'desktop' | 'tablet' | 'mobile';

export interface RiskWeights {
  rainfall: number; // e.g. 45%
  historical: number; // e.g. 35%
  terrain: number; // e.g. 20%
}

export interface CityNode {
  id: string;
  name: string;
  state: string;
  district: string;
  x: number; // SVG percentage or coordinate
  y: number;
  lat: number; // WGS84 latitude
  lng: number; // WGS84 longitude
  importance: 'hub' | 'major' | 'secondary';
  accessible: boolean;
}

export interface RouteOption {
  id: string;
  name: string;
  path: string[]; // road IDs
  nodes: string[]; // City names
  etaString: string;
  etaMinutes: number;
  distanceKm: number;
  riskScore: number;
  costTier: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  restrictedSegmentsCount: number;
  blockedSegmentsCount: number;
  recommendationReason: string;
  isRecommended: boolean;
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: 'Bridge' | 'Tunnel' | 'Warehouse' | 'Hospital' | 'Fuel Station' | 'Relief Center' | 'Road Segment';
  state: string;
  district: string;
  location: string;
  condition: 'Operational' | 'Requires Inspection' | 'Damaged' | 'Critical';
  riskScore: number;
  lastInspected: string;
  capacity?: string;
  contactPerson?: string;
  phone?: string;
}

export interface SystemIntegration {
  id: string;
  name: string;
  category: 'Weather' | 'GIS' | 'GPS Telematics' | 'Traffic Feed' | 'Govt Portal' | 'Notifications';
  provider: string;
  status: 'Connected' | 'Warning' | 'Offline';
  latencyMs: number;
  lastSync: string;
  healthScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  location: string;
  status: 'Created' | 'Updated' | 'Approved' | 'Rejected' | 'Rerouted';
}

export interface VehicleTelemetry {
  vehicleId: string;
  driverName: string;
  driverPhone: string;
  cargo: string;
  speedKmH: number;
  fuelPercent: number;
  coldChainTempC: number;
  lat: number;
  lng: number;
  progressPercent: number;
  currentRoadId: string;
  engineStatus: 'RUNNING' | 'IDLE' | 'EMERGENCY_HALT';
  lastTelemetryTime: string;
}

export interface IsochroneZone {
  id: string;
  centerCity: string;
  minutes: number; // e.g. 30, 60, 120
  radiusKm: number;
  color: string;
}

export interface VRPStop {
  id: string;
  city: string;
  demandKg: number;
  timeWindow: string;
  priority: 'High' | 'Normal' | 'Emergency';
}

export interface VRPSolution {
  totalDistanceKm: number;
  totalTimeMins: number;
  capacityUsedPercent: number;
  optimizedSequence: string[];
  vehicleCount: number;
  costSavedRupees: number;
}


