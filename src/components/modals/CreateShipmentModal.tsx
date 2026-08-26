import React, { useState } from 'react';
import { X, Truck, Plus, CheckCircle, ShieldCheck } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { CargoType, ShipmentPriority } from '../../types';
import { INITIAL_CITIES } from '../../data/initialData';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({ isOpen, onClose }) => {
  const { createShipment, roads } = useLogistics();
  const [cargoName, setCargoName] = useState('Critical Anti-Venom & Dialysis Kits');
  const [cargoType, setCargoType] = useState<CargoType>('Medicine');
  const [priority, setPriority] = useState<ShipmentPriority>('Emergency');
  const [origin, setOrigin] = useState('Dimapur');
  const [destination, setDestination] = useState('Kohima');
  const [vehicle, setVehicle] = useState('TRK-902 (Temperature Controlled Van)');
  const [driverName, setDriverName] = useState('Anand Verma');
  const [driverPhone, setDriverPhone] = useState('+91 94355 88991');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Choose appropriate route based on road statuses
    const directRoad = roads.find(
      r => r.origin.toLowerCase() === origin.toLowerCase() && r.destination.toLowerCase() === destination.toLowerCase()
    );

    const isDirectBlocked = directRoad?.status === 'BLOCKED';
    const activeRoute = isDirectBlocked ? ['DIM-WOK-00', 'KOH-WOK-02'] : directRoad ? [directRoad.id] : ['DIM-KOH-01'];
    const etaString = isDirectBlocked ? '18:45 IST' : '18:20 IST';

    createShipment({
      cargo: cargoName,
      cargoType,
      priority,
      origin,
      destination,
      vehicle,
      driverName,
      driverPhone,
      status: isDirectBlocked ? 'REROUTED' : 'IN TRANSIT',
      originalEta: '18:20 IST',
      updatedEta: etaString,
      riskLevel: isDirectBlocked ? 'Low' : 'Medium',
      currentCorridor: isDirectBlocked ? 'DIM-WOK-00 (Bypass assigned)' : activeRoute[0] || 'DIM-KOH-01',
      originalRoute: ['DIM-KOH-01'],
      activeRoute,
      rerouteReason: isDirectBlocked ? 'Primary corridor blocked. Assigned Wokha bypass on creation.' : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-950 px-5 py-4 text-white flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/30 border border-blue-500/50 text-blue-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Dispatch Essential Goods Shipment</h3>
              <p className="text-xs text-blue-300">Cargo-aware priority routing and transit manifest</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-blue-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Cargo Classification
              </label>
              <select
                value={cargoType}
                onChange={e => setCargoType(e.target.value as CargoType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Medicine">Medicine & Vaccines (High Risk Avoidance)</option>
                <option value="Perishable Food">Perishable Food & Milk</option>
                <option value="Agricultural Produce">Agricultural Produce</option>
                <option value="Construction Material">Construction Material</option>
                <option value="Liquid Oxygen">Liquid Oxygen (Emergency)</option>
                <option value="General Freight">General Freight</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as ShipmentPriority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Emergency">Emergency (Green Corridor)</option>
                <option value="High">High Priority</option>
                <option value="Normal">Normal Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Cargo Description
            </label>
            <input
              type="text"
              value={cargoName}
              onChange={e => setCargoName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Origin Depot
              </label>
              <select
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {INITIAL_CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.state})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Destination Terminal
              </label>
              <select
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {INITIAL_CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.state})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Vehicle ID / Type
              </label>
              <input
                type="text"
                value={vehicle}
                onChange={e => setVehicle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Assigned Driver & Phone
              </label>
              <input
                type="text"
                value={`${driverName} | ${driverPhone}`}
                onChange={e => {
                  const parts = e.target.value.split('|');
                  setDriverName(parts[0]?.trim() || driverName);
                  if (parts[1]) setDriverPhone(parts[1]?.trim());
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                required
              />
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
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-sm transition-all"
            >
              Dispatch Shipment
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
