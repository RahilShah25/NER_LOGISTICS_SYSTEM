import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Truck,
  Activity,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { UserRole } from '../../types';

export const LoginScreen: React.FC = () => {
  const { setCurrentScreen, setCurrentRole, currentRole, showToast } = useLogistics();
  const [email, setEmail] = useState('officer.dimapur@ner-logistics.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('District Officer');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(role);
    setCurrentScreen('dashboard');
    showToast('success', 'Authenticated Successfully', `Welcome back, ${role}. Command session initialized.`);
  };

  const handleDemoSignIn = (demoRole: UserRole) => {
    setCurrentRole(demoRole);
    if (demoRole === 'Field Worker') {
      setCurrentScreen('field-report');
    } else if (demoRole === 'State Officer') {
      setCurrentScreen('state-command');
    } else {
      setCurrentScreen('dashboard');
    }
    showToast('info', 'Demo Session Active', `Logged in as ${demoRole} with full interactive privileges.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-100">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* LEFT SIDE: Government Branding & Positioning */}
        <div className="lg:col-span-7 p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/80 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Background Hex Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Government Emblem / Hex Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 border border-blue-400/40 flex items-center justify-center shadow-lg shadow-blue-900/40">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold block">
                  GOVERNMENT OF INDIA • NORTHEAST LOGISTICS COMMAND
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  NER Logistics Decision Layer
                </h1>
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mt-6">
              “Keep essential goods moving when roads fail.”
            </h2>

            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Real-time accessibility visibility, risk-aware routing and disruption response for Northeast India.
            </p>

            {/* Feature Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              {[
                { title: 'Road Accessibility', desc: 'Real-time corridor status & IoT alerts' },
                { title: 'Risk Assessment', desc: 'Multi-factor terrain & rainfall index' },
                { title: 'Cargo-Aware Routing', desc: 'Medicine & perishable priority optimization' },
                { title: 'Shipment Monitoring', desc: 'Live ETA recalculation & automated bypass' },
                { title: 'Offline Reporting', desc: 'Zero-connectivity 2G SMS & local sync' },
                { title: 'Disruption Escalation', desc: 'Field → District → State Command ladder' },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">{feat.title}</span>
                    <span className="text-[11px] text-slate-400 leading-tight">{feat.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tagline Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-blue-300">From Hazard Data to Logistics Action</span>
            <span>Version 2.4 Command Build</span>
          </div>

        </div>

        {/* RIGHT SIDE: Login Card */}
        <div className="lg:col-span-5 p-8 sm:p-10 bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                SECURE AUTHENTICATION
              </span>
              <h3 className="text-xl font-extrabold text-white">Operations Sign In</h3>
              <p className="text-xs text-slate-400 mt-1">
                Access your designated district or state command portal
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Official Mobile / Gov Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Password / Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Designated Operational Role
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="District Officer">District Officer (Dimapur District)</option>
                    <option value="State Officer">State Officer (Northeast Regional Command)</option>
                    <option value="Logistics Operator">Logistics Operator (Fleet & Freight)</option>
                    <option value="Field Worker">Field Worker (Mobile Incident Reporter)</option>
                    <option value="Administrator">Administrator (Risk & System Config)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Sign In to Command Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                ⚡ Instant Hackathon Demo Logins:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('District Officer')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-slate-200 transition-colors"
                >
                  <span className="font-bold block text-blue-400">District Officer</span>
                  <span className="text-[10px] text-slate-400">Dimapur Command</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoSignIn('State Officer')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-slate-200 transition-colors"
                >
                  <span className="font-bold block text-purple-400">State Officer</span>
                  <span className="text-[10px] text-slate-400">7 States Aggregated</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoSignIn('Logistics Operator')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-slate-200 transition-colors"
                >
                  <span className="font-bold block text-emerald-400">Logistics Operator</span>
                  <span className="text-[10px] text-slate-400">Route & Shipments</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoSignIn('Field Worker')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-slate-200 transition-colors"
                >
                  <span className="font-bold block text-amber-400">Field Worker</span>
                  <span className="text-[10px] text-slate-400">Mobile & Offline Mode</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400 mt-6">
            Government Logistics Operations Platform • Smart India Hackathon
          </div>
        </div>

      </div>
    </div>
  );
};
