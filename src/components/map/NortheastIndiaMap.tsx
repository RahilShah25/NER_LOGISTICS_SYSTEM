import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Plus,
  Minus,
  Navigation,
  Truck,
  AlertTriangle,
  Activity,
  Compass,
  MapPin,
  CheckCircle,
  Radio,
  Eye
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { INITIAL_CITIES } from '../../data/initialData';
import { Road, Shipment, Incident } from '../../types';

interface MapProps {
  interactive?: boolean;
  heightClass?: string;
  selectedRoadHighlight?: string | null;
  selectedShipmentHighlight?: string | null;
  onSelectRoad?: (roadId: string) => void;
  onSelectShipment?: (shipmentId: string) => void;
  onSelectIncident?: (incidentId: string) => void;
}

export const NortheastIndiaMap: React.FC<MapProps> = ({
  interactive = true,
  heightClass = 'h-[460px] sm:h-[520px] lg:h-[600px]',
  selectedRoadHighlight,
  selectedShipmentHighlight,
  onSelectRoad,
  onSelectShipment,
  onSelectIncident
}) => {
  const {
    roads,
    shipments,
    incidents,
    setSelectedRoadId,
    setSelectedShipmentId,
    setSelectedIncidentId,
    setCurrentScreen,
    telemetryTicks,
    isLiveStreaming,
    setIsLiveStreaming
  } = useLogistics();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Basemap Tile Styles
  const [activeTileStyle, setActiveTileStyle] = useState<'light' | 'dark' | 'satellite'>('light');
  const [activeLayers, setActiveLayers] = useState({
    roads: true,
    vehicles: true,
    incidents: true,
    isochrones: true,
    cityHubs: true
  });
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Clean Basemap Tile URLs
  const tileUrls = {
    light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const getCityCoords = (nameOrId: string): [number, number] => {
    const city = INITIAL_CITIES.find(
      c => c.name.toLowerCase() === nameOrId.toLowerCase() || c.id.toLowerCase() === nameOrId.toLowerCase()
    );
    if (city && city.lat && city.lng) return [city.lat, city.lng];
    return [25.8, 93.2];
  };

  // Initialize Map without watermarks
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [25.8, 93.2],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer(tileUrls[activeTileStyle], {
        maxZoom: 18,
        attribution: ''
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrls[activeTileStyle], {
      maxZoom: 18,
      attribution: ''
    }).addTo(map);
  }, [activeTileStyle]);

  // Render Overlays & Animated Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer(layer => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // 1. ISOCHRONES
    if (activeLayers.isochrones) {
      const hubs = [
        { name: 'Guwahati', coords: [26.1445, 91.7362] as [number, number] },
        { name: 'Dimapur', coords: [25.9060, 93.7270] as [number, number] },
        { name: 'Silchar', coords: [24.8333, 92.7789] as [number, number] }
      ];

      hubs.forEach(h => {
        L.circle(h.coords, {
          radius: 80000,
          color: '#0d9488',
          fillColor: '#0d9488',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '4,4'
        }).addTo(map);

        L.circle(h.coords, {
          radius: 45000,
          color: '#f59e0b',
          fillColor: '#f59e0b',
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '3,3'
        }).addTo(map);

        L.circle(h.coords, {
          radius: 25000,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.18,
          weight: 2
        }).addTo(map);
      });
    }

    // 2. ROAD CORRIDORS
    if (activeLayers.roads) {
      roads.forEach(road => {
        const start = getCityCoords(road.origin);
        const end = getCityCoords(road.destination);

        const isBlocked = road.status === 'BLOCKED';
        const isRestricted = road.status === 'RESTRICTED';
        const isHighlighted = selectedRoadHighlight === road.id;

        let strokeColor = '#10b981';
        let weight = 4;
        let dashArray = undefined;

        if (isBlocked) {
          strokeColor = '#f43f5e';
          weight = 6;
        } else if (isRestricted) {
          strokeColor = '#f59e0b';
          weight = 5;
          dashArray = '6, 6';
        }

        if (isHighlighted) weight += 3;

        const polyline = L.polyline([start, end], {
          color: strokeColor,
          weight,
          dashArray,
          opacity: 0.9
        }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
            <div style="font-size: 13px; font-weight: 800; color: #1e293b;">${road.name}</div>
            <div style="font-size: 11px; margin-top: 2px;">Corridor Code: <strong>${road.id}</strong></div>
            <div style="font-size: 11px; margin-top: 2px;">Status: <span style="color: ${isBlocked ? '#e11d48' : '#059669'}; font-weight: 700;">${road.status}</span></div>
            <div style="font-size: 11px; margin-top: 2px;">Risk Score: <strong>${road.riskScore}/100</strong></div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">${road.notes}</div>
          </div>
        `;
        polyline.bindPopup(popupContent);

        polyline.on('click', () => {
          if (onSelectRoad) onSelectRoad(road.id);
          else {
            setSelectedRoadId(road.id);
            setCurrentScreen('road-detail');
          }
        });
      });
    }

    // 3. ANIMATED VEHICLES
    if (activeLayers.vehicles) {
      shipments.forEach((s, idx) => {
        const origCoords = getCityCoords(s.origin);
        const destCoords = getCityCoords(s.destination);

        const progressFraction = ((telemetryTicks * 4 + idx * 30) % 100) / 100;
        const currentLat = origCoords[0] + (destCoords[0] - origCoords[0]) * progressFraction;
        const currentLng = origCoords[1] + (destCoords[1] - origCoords[1]) * progressFraction;

        const liveSpeed = s.status === 'REROUTED' ? 44 : 58 + ((telemetryTicks + idx) % 7);

        const vehicleHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 26px; height: 26px; background-color: ${s.status === 'REROUTED' ? '#9333ea' : '#0d9488'}; opacity: 0.35; border-radius: 50%; animation: ping 1.5s infinite;"></div>
            <div style="background-color: ${s.status === 'REROUTED' ? '#9333ea' : '#0d9488'}; border: 2px solid #ffffff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(13,148,136,0.4);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10z"/></svg>
            </div>
            <div style="position: absolute; top: -16px; background-color: #ffffff; border: 1px solid #0d9488; border-radius: 4px; padding: 1px 4px; font-size: 9px; font-weight: 800; font-family: monospace; color: #0f766e; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              ${s.id.replace('NER-', '')} • ${liveSpeed}km/h
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: vehicleHtml,
          className: 'custom-vehicle-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const vehicleMarker = L.marker([currentLat, currentLng], { icon: customIcon }).addTo(map);

        vehicleMarker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
            <div style="font-size: 12px; font-weight: 800; color: #0f766e;">${s.vehicle} (${s.id})</div>
            <div style="font-size: 11px; margin-top: 2px;">Cargo: <strong>${s.cargo}</strong></div>
            <div style="font-size: 11px; margin-top: 2px;">Driver: <strong>${s.driverName} (${s.driverPhone})</strong></div>
            <div style="font-size: 11px; margin-top: 2px;">Status: <span style="color: #0d9488; font-weight: 700;">${s.status}</span></div>
            <div style="font-size: 10px; color: #059669; font-weight: 700; margin-top: 4px;">Cold-Chain Storage: 3.8°C (Optimal)</div>
          </div>
        `);

        vehicleMarker.on('click', () => {
          if (onSelectShipment) onSelectShipment(s.id);
          else {
            setSelectedShipmentId(s.id);
            setCurrentScreen('shipment-detail');
          }
        });
      });
    }

    // 4. INCIDENT HAZARDS
    if (activeLayers.incidents) {
      incidents.filter(i => i.status !== 'Resolved').forEach(incident => {
        const road = roads.find(r => r.id === incident.roadCode);
        if (!road) return;
        const start = getCityCoords(road.origin);
        const end = getCityCoords(road.destination);
        const hazardLat = (start[0] + end[0]) / 2;
        const hazardLng = (start[1] + end[1]) / 2;

        const hazardHtml = `
          <div style="background-color: #e11d48; border: 2px solid #ffffff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(225,29,72,0.4); animation: bounce 1s infinite;">
            <span style="color: #ffffff; font-weight: 900; font-size: 13px;">!</span>
          </div>
        `;

        const hazardIcon = L.divIcon({
          html: hazardHtml,
          className: 'hazard-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const hazardMarker = L.marker([hazardLat, hazardLng], { icon: hazardIcon }).addTo(map);

        hazardMarker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
            <div style="font-size: 12px; font-weight: 800; color: #e11d48;">INCIDENT HAZARD: ${incident.type}</div>
            <div style="font-size: 11px; margin-top: 2px;">Severity: <strong>${incident.severity}</strong></div>
            <div style="font-size: 11px; margin-top: 2px;">Location: <strong>${incident.roadCode}</strong></div>
            <div style="font-size: 10px; color: #475569; margin-top: 4px;">${incident.description}</div>
          </div>
        `);

        hazardMarker.on('click', () => {
          if (onSelectIncident) onSelectIncident(incident.id);
          else {
            setSelectedIncidentId(incident.id);
            setCurrentScreen('incident-detail');
          }
        });
      });
    }

    // 5. CITIES
    if (activeLayers.cityHubs) {
      INITIAL_CITIES.forEach(city => {
        if (!city.lat || !city.lng) return;

        const isHub = city.importance === 'hub';

        const cityHtml = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background-color: ${isHub ? '#0d9488' : '#475569'}; border: 2px solid #ffffff; width: ${isHub ? '14px' : '10px'}; height: ${isHub ? '14px' : '10px'}; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
            <div style="font-size: 10px; font-weight: 800; color: #0f172a; background: rgba(255,255,255,0.95); padding: 1px 4px; border-radius: 4px; border: 1px solid #99f6e4; margin-top: 2px; white-space: nowrap; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">${city.name}</div>
          </div>
        `;

        const cityIcon = L.divIcon({
          html: cityHtml,
          className: 'city-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        L.marker([city.lat, city.lng], { icon: cityIcon }).addTo(map);
      });
    }

  }, [activeLayers, activeTileStyle, roads, shipments, incidents, telemetryTicks]);

  return (
    <div className={`relative w-full ${heightClass} bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-md font-sans select-none`}>
      
      {/* Floating Header Controls Container (Responsive Flex Layout with Zero Overlap) */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Floating Title & Telemetry Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 flex items-center gap-2 shadow-md">
            <span className={`w-2.5 h-2.5 rounded-full ${isLiveStreaming ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
            <span className="text-xs font-bold tracking-tight text-slate-800">NER-LINK GIS MAP</span>
            <span className="text-[10px] text-teal-600 font-mono hidden md:inline">NORDIC TEAL GIS</span>
          </div>

          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-md ${
              isLiveStreaming
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-white border-slate-300 text-slate-600'
            }`}
            title="Toggle WebSocket Telematics Stream"
          >
            <Activity className="w-3.5 h-3.5 inline mr-1" />
            <span className="hidden sm:inline">{isLiveStreaming ? 'LIVE (60Hz)' : 'PAUSED'}</span>
          </button>
        </div>

        {/* Right Floating Basemap & Layer Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Basemap Style Selector */}
          <div className="flex bg-white/95 border border-slate-200 rounded-xl p-0.5 shadow-md text-[11px] font-bold text-slate-700">
            {(['light', 'dark', 'satellite'] as const).map(style => (
              <button
                key={style}
                onClick={() => setActiveTileStyle(style)}
                className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                  activeTileStyle === style ? 'bg-teal-600 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Layer Toggle Menu */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="p-2 rounded-xl bg-white/95 hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Toggle Map Layers"
            >
              <Layers className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Layers</span>
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl p-2.5 z-[1001] text-xs space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span>GIS Overlays</span>
                  <span className="text-teal-600 font-mono text-[9px]">Leaflet</span>
                </div>
                {Object.keys(activeLayers).map(key => (
                  <label
                    key={key}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-800"
                  >
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <input
                      type="checkbox"
                      checked={activeLayers[key as keyof typeof activeLayers]}
                      onChange={e =>
                        setActiveLayers(prev => ({ ...prev, [key]: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-0 w-3.5 h-3.5"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* REAL LEAFLET MAP CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 flex flex-wrap items-center gap-3 shadow-md">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GIS LEGEND:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-emerald-500 rounded"></span>
          <span className="text-[11px] font-bold text-emerald-700">OPEN Road</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-rose-500 rounded"></span>
          <span className="text-[11px] font-bold text-rose-700">BLOCKED Corridor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
          <span className="text-[11px] text-teal-800 font-bold">Live Vehicle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500/30 border border-teal-600"></span>
          <span className="text-[11px] text-teal-700 font-semibold">30-min Isochrone</span>
        </div>
      </div>

    </div>
  );
};
