import React, { useState } from 'react';
import { X, TrendingUp, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

interface EscalateModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: string;
}

export const EscalateModal: React.FC<EscalateModalProps> = ({ isOpen, onClose, incidentId }) => {
  const { incidents, escalateIncident, currentRole, activeDistrict } = useLogistics();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidentId || 'INC-0091');
  const [targetLevel, setTargetLevel] = useState<'District' | 'State'>('State');
  const [reason, setReason] = useState('Critical blockage exceeds district clearance capacity. Immediate NDRF / BRO earthmoving units required.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    escalateIncident(selectedIncidentId, targetLevel, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-rose-950 px-5 py-4 text-white flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-600/30 border border-rose-500/50 text-rose-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Escalate Disruption Incident</h3>
              <p className="text-xs text-rose-300">Multi-tier escalation to Higher Command authority</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-rose-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Incident ID
            </label>
            <select
              value={selectedIncidentId}
              onChange={e => setSelectedIncidentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {incidents.map(inc => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} - {inc.type} on {inc.roadCode} ({inc.severity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Escalate Target Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTargetLevel('District')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  targetLevel === 'District'
                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>District EOC Command</span>
                  {targetLevel === 'District' && <ArrowUpRight className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Inter-departmental District level response</div>
              </button>

              <button
                type="button"
                onClick={() => setTargetLevel('State')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  targetLevel === 'State'
                    ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500'
                    : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Northeast State Command</span>
                  {targetLevel === 'State' && <ArrowUpRight className="w-4 h-4 text-rose-600" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Regional Multi-State resource deployment</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Justification & Required Resources
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Detail reasons for escalating beyond local jurisdiction..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-rose-500"
              required
            />
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
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 font-bold text-white shadow-sm transition-all"
            >
              Confirm Escalation
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
