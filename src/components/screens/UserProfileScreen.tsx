import React, { useState } from 'react';
import {
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  Bell,
  Globe,
  Save,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { Language, UserRole } from '../../types';

export const UserProfileScreen: React.FC = () => {
  const { currentRole, setCurrentRole, activeDistrict, language, setLanguage, showToast } = useLogistics();

  const [name, setName] = useState('Officer Rajesh Sharma');
  const [email, setEmail] = useState('officer.dimapur@ner-logistics.gov.in');
  const [phone, setPhone] = useState('+91 94350 12345');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [shipmentAlerts, setShipmentAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Profile Preferences Saved', 'Notification channels and profile metadata updated.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md">
            {name.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{name}</h1>
            <p className="text-xs text-slate-500">
              {currentRole} • {activeDistrict} District Command Desk
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
          Govt. ID Verified
        </span>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-5 text-xs">
        
        {/* Officer Information Card */}
        <div className="gov-card p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Command Officer Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Official Designation / Role
              </label>
              <select
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="District Officer">District Officer</option>
                <option value="State Officer">State Officer</option>
                <option value="Logistics Operator">Logistics Operator</option>
                <option value="Field Worker">Field Worker</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Emergency Contact Mobile
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Language & Regional Localization */}
        <div className="gov-card p-5 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Language & Regional Localization
          </h3>

          <div className="flex items-center gap-3">
            {[
              { id: 'EN', label: 'English (Command Standard)' },
              { id: 'HI', label: 'हिन्दी (Hindi)' },
              { id: 'AS', label: 'অসমীয়া (Assamese)' },
            ].map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLanguage(l.id as Language)}
                className={`p-3 rounded-lg border flex-1 text-left transition-all ${
                  language === l.id
                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold text-slate-900 block">{l.label}</span>
                <span className="text-[10px] text-slate-500">Regional Interface</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="gov-card p-5 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Disruption Alert Subscription Channels
          </h3>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Critical Road Blockage SMS</span>
                <span className="text-[11px] text-slate-500">Receive high-priority SMS alerts for impassable corridors</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={e => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Immediate Medical Shipment Diversions</span>
                <span className="text-[11px] text-slate-500">Instant notification when a medicine or vaccine shipment is rerouted</span>
              </div>
              <input
                type="checkbox"
                checked={criticalAlerts}
                onChange={e => setCriticalAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">General Freight & Agricultural Transit Warnings</span>
                <span className="text-[11px] text-slate-500">Updates for single-lane culvert repairs and heavy rainfall cautions</span>
              </div>
              <input
                type="checkbox"
                checked={shipmentAlerts}
                onChange={e => setShipmentAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>

    </div>
  );
};
