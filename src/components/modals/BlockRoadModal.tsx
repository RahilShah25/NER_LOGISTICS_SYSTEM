import React, { useState } from 'react';
import { X, OctagonX, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { RoadStatus } from '../../types';

interface BlockRoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadId?: string;
}

export const BlockRoadModal: React.FC<BlockRoadModalProps> = ({ isOpen, onClose, roadId }) => {
  const { roads, updateRoadStatus, currentRole, activeDistrict } = useLogistics();
  const [selectedRoad, setSelectedRoad] = useState<string>(roadId || 'DIM-KOH-01');
  const [status, setStatus] = useState<RoadStatus>('BLOCKED');
  const [cause, setCause] = useState('Landslide debris blockage');
  const [notes, setNotes] = useState('Immediate closure enforced. Both carriageways obstructed.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRoadStatus(
      selectedRoad,
      status,
      `${cause} - ${notes}`,
      `${currentRole} (${activeDistrict})`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-600/30 border border-rose-500/50 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Corridor Status Control</h3>
              <p className="text-xs text-slate-400">Enforce accessibility restriction across Logistics Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Select Road Corridor
            </label>
            <select
              value={selectedRoad}
              onChange={e => setSelectedRoad(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {roads.map(r => (
                <option key={r.id} value={r.id}>
                  {r.id} - {r.name} ({r.state}) [Current: {r.status}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Set Operational Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('BLOCKED')}
                className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  status === 'BLOCKED'
                    ? 'bg-rose-100 border-rose-500 text-rose-900 shadow-sm ring-1 ring-rose-500'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <OctagonX className="w-3.5 h-3.5 text-rose-600" />
                <span>BLOCKED</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('RESTRICTED')}
                className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  status === 'RESTRICTED'
                    ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-sm ring-1 ring-amber-500'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>RESTRICTED</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('OPEN')}
                className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  status === 'OPEN'
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-sm ring-1 ring-emerald-500'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>OPEN</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Disruption Reason / Hazard Cause
            </label>
            <input
              type="text"
              value={cause}
              onChange={e => setCause(e.target.value)}
              placeholder="e.g. Landslide, Flash Flood, Culvert Collapse"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Operational Notes & Directives
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Provide detour guidance or clearance timeline..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900 text-[11px] leading-relaxed">
            <span className="font-bold">Automated Decision Consequence:</span> Marking this road as{' '}
            <strong className="uppercase">{status}</strong> will immediately trigger cargo-aware alternate route calculation for all active shipments and broadcast a Critical Alert.
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
              className={`px-4 py-2 rounded-lg font-bold text-white shadow-sm transition-all ${
                status === 'BLOCKED'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : status === 'RESTRICTED'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              Apply Status Update
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
