import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Maximize2,
  Navigation,
  ShieldAlert,
  Truck,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  X,
  ExternalLink,
  ArrowRight,
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { NortheastIndiaMap } from '../map/NortheastIndiaMap';

export const LiveMapScreen: React.FC = () => {
  const {
    roads,
    shipments,
    incidents,
    selectedRoadId,
    selectedShipmentId,
    selectedIncidentId,
    setSelectedRoadId,
    setSelectedShipmentId,
    setSelectedIncidentId,
    setCurrentScreen,
    updateRoadStatus,
    rerouteShipment
  } = useLogistics();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'blocked' | 'restricted' | 'shipments'>('all');
  const [bottomSheetState, setBottomSheetState] = useState<'collapsed' | 'half' | 'expanded'>('half');

  const selectedRoad = roads.find(r => r.id === selectedRoadId);
  const selectedShipment = shipments.find(s => s.id === selectedShipmentId);
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  // Determine active item to show in detail drawer
  const activeDetailType = selectedIncidentId ? 'incident' : selectedShipmentId ? 'shipment' : selectedRoadId ? 'road' : null;

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[540px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      
      {/* Top Search & Floating Filter Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Search Bar */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3.5 py-2 shadow-2xl w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search corridor, vehicle, district..."
            className="bg-transparent border-none text-xs text-white placeholder-slate-400 focus:outline-none w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-2xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Corridors ({roads.length})
          </button>
          <button
            onClick={() => setActiveFilter('blocked')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'blocked' ? 'bg-rose-600 text-white shadow' : 'text-rose-400 hover:bg-slate-800'
            }`}
          >
            Blocked ({roads.filter(r => r.status === 'BLOCKED').length})
          </button>
          <button
            onClick={() => setActiveFilter('restricted')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'restricted' ? 'bg-amber-600 text-white shadow' : 'text-amber-400 hover:bg-slate-800'
            }`}
          >
            Restricted ({roads.filter(r => r.status === 'RESTRICTED').length})
          </button>
          <button
            onClick={() => setActiveFilter('shipments')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'shipments' ? 'bg-purple-600 text-white shadow' : 'text-purple-400 hover:bg-slate-800'
            }`}
          >
            Vehicles ({shipments.length})
          </button>
        </div>

      </div>

      {/* Main Fullscreen Map Canvas */}
      <div className="flex-1 w-full h-full relative">
        <NortheastIndiaMap
          heightClass="h-full"
          selectedRoadHighlight={selectedRoadId}
          selectedShipmentHighlight={selectedShipmentId}
          onSelectRoad={id => {
            setSelectedRoadId(id);
            setSelectedShipmentId(null);
            setSelectedIncidentId(null);
            setBottomSheetState('half');
          }}
          onSelectShipment={id => {
            setSelectedShipmentId(id);
            setSelectedRoadId(null);
            setSelectedIncidentId(null);
            setBottomSheetState('half');
          }}
          onSelectIncident={id => {
            setSelectedIncidentId(id);
            setSelectedRoadId(null);
            setSelectedShipmentId(null);
            setBottomSheetState('half');
          }}
        />
      </div>

      {/* Selected Entity Bottom Sheet Drawer (Mobile & Responsive Tablet/Desktop) */}
      {activeDetailType && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/80 shadow-2xl transition-all duration-300 flex flex-col ${
            bottomSheetState === 'collapsed'
              ? 'h-14 overflow-hidden'
              : bottomSheetState === 'half'
              ? 'max-h-[50%] min-h-[220px]'
              : 'h-[85%]'
          }`}
        >
          {/* Drawer Handle & Toggle Bar */}
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between cursor-pointer bg-slate-900 select-none"
               onClick={() => setBottomSheetState(prev => prev === 'collapsed' ? 'half' : prev === 'half' ? 'expanded' : 'collapsed')}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-1 bg-slate-600 rounded-full mx-auto sm:hidden"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>Selected {activeDetailType} Details</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBottomSheetState(prev => prev === 'expanded' ? 'half' : 'expanded');
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                {bottomSheetState === 'expanded' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRoadId(null);
                  setSelectedShipmentId(null);
                  setSelectedIncidentId(null);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="p-5 overflow-y-auto space-y-4 text-slate-100 flex-1">
            
            {/* ROAD DETAIL VIEW */}
            {activeDetailType === 'road' && selectedRoad && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-blue-400 font-bold">{selectedRoad.id}</span>
                    <h3 className="text-lg font-bold text-white">{selectedRoad.name}</h3>
                    <p className="text-xs text-slate-400">{selectedRoad.state} • District: {selectedRoad.district}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedRoad.status === 'BLOCKED'
                        ? 'bg-rose-950 text-rose-300 border border-rose-600'
                        : selectedRoad.status === 'RESTRICTED'
                        ? 'bg-amber-950 text-amber-300 border border-amber-600'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                    }`}>
                      ● {selectedRoad.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Risk Index</div>
                    <div className="text-lg font-black text-amber-400">{selectedRoad.riskScore} / 100</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Rainfall Level</div>
                    <div className="text-lg font-black text-blue-400">{selectedRoad.rainfallLevel}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Length</div>
                    <div className="text-lg font-black text-white">{selectedRoad.lengthKm} km</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Normal Travel</div>
                    <div className="text-lg font-black text-white">{selectedRoad.normalTravelTimeMins} mins</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-white">Latest Intelligence Notes: </span>
                  {selectedRoad.notes}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentScreen('route-planner')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <span>Plan Alternate Route</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {selectedRoad.status === 'BLOCKED' ? (
                    <button
                      onClick={() => updateRoadStatus(selectedRoad.id, 'OPEN', 'Manual override by command officer.')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Reopen Corridor
                    </button>
                  ) : (
                    <button
                      onClick={() => updateRoadStatus(selectedRoad.id, 'BLOCKED', 'Emergency manual blockage.')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      Mark Blocked
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* SHIPMENT DETAIL VIEW */}
            {activeDetailType === 'shipment' && selectedShipment && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-purple-400 font-bold">{selectedShipment.id}</span>
                    <h3 className="text-lg font-bold text-white">{selectedShipment.cargo}</h3>
                    <p className="text-xs text-slate-400">Driver: {selectedShipment.driverName} ({selectedShipment.driverPhone})</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedShipment.status === 'REROUTED' ? 'bg-purple-950 text-purple-300 border border-purple-600' : 'bg-blue-950 text-blue-300 border border-blue-600'
                  }`}>
                    ● {selectedShipment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Priority</div>
                    <div className="text-sm font-bold text-rose-400">{selectedShipment.priority}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">ETA</div>
                    <div className="text-sm font-bold text-emerald-400">{selectedShipment.updatedEta}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Vehicle</div>
                    <div className="text-sm font-bold text-white">{selectedShipment.vehicle}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Delay</div>
                    <div className="text-sm font-bold text-amber-400">+{selectedShipment.delayMinutes} mins</div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentScreen('shipment-detail')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Open Full Shipment Timeline</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* INCIDENT DETAIL VIEW */}
            {activeDetailType === 'incident' && selectedIncident && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-rose-400 font-bold">{selectedIncident.id}</span>
                    <h3 className="text-lg font-bold text-white">{selectedIncident.type} - {selectedIncident.location}</h3>
                    <p className="text-xs text-slate-400">Reported by: {selectedIncident.reporter}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-600">
                    ● {selectedIncident.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{selectedIncident.description}</p>

                <button
                  onClick={() => setCurrentScreen('incident-detail')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  View Incident & Action Plan
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
