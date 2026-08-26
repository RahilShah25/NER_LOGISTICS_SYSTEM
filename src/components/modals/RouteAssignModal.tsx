import React from 'react';
import { X, CheckCircle, Navigation, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { RouteOption } from '../../types';

interface RouteAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeOption: RouteOption | null;
  cargoType: string;
  origin: string;
  destination: string;
}

export const RouteAssignModal: React.FC<RouteAssignModalProps> = ({
  isOpen,
  onClose,
  routeOption,
  cargoType,
  origin,
  destination
}) => {
  const { shipments, rerouteShipment, setCurrentScreen, setSelectedShipmentId, showToast } = useLogistics();

  if (!isOpen || !routeOption) return null;

  const handleAssignToShipment = (shipmentId: string) => {
    rerouteShipment(
      shipmentId,
      routeOption.path,
      routeOption.etaString,
      Math.max(0, routeOption.etaMinutes - 110),
      `Assigned optimized route via ${routeOption.nodes.join(' → ')} (${routeOption.recommendationReason})`
    );
    setSelectedShipmentId(shipmentId);
    setCurrentScreen('shipment-detail');
    onClose();
  };

  const eligibleShipments = shipments.filter(
    s => s.status !== 'DELIVERED'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600/30 border border-emerald-500/50 text-emerald-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Assign Calculated Route</h3>
              <p className="text-xs text-slate-400">Commit optimized bypass to active cargo manifest</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">{routeOption.name}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                Risk {routeOption.riskScore}/100
              </span>
            </div>
            
            <div className="flex items-center gap-2 font-mono text-xs text-blue-700 font-bold">
              {routeOption.nodes.map((node, i) => (
                <React.Fragment key={node}>
                  <span>{node}</span>
                  {i < routeOption.nodes.length - 1 && <span className="text-slate-400">→</span>}
                </React.Fragment>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-slate-600">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">ETA</span>
                <span className="font-bold text-slate-800">{routeOption.etaString}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Distance</span>
                <span className="font-bold text-slate-800">{routeOption.distanceKm} km</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Cost Tier</span>
                <span className="font-bold text-slate-800">{routeOption.costTier}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
              Select Active Shipment to Assign:
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {eligibleShipments.map(s => (
                <div
                  key={s.id}
                  onClick={() => handleAssignToShipment(s.id)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600">{s.id}</span>
                      <span className="font-bold text-slate-800">{s.cargo}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {s.origin} → {s.destination} ({s.vehicle})
                    </div>
                  </div>
                  <button className="px-2.5 py-1 rounded bg-slate-900 group-hover:bg-blue-600 text-white font-bold text-[11px] transition-colors">
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
