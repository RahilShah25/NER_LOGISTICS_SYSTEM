import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Camera,
  MapPin,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertTriangle,
  Upload,
  Sparkles,
  Save,
  Send,
  CloudOff,
  Mic
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { IncidentType, IncidentSeverity } from '../../types';

export const FieldReportMobileScreen: React.FC = () => {
  const { isOnline, setIsOnline, addOfflineReport, roads, setCurrentScreen, showToast } = useLogistics();

  const [roadCode, setRoadCode] = useState('DIM-KOH-01');
  const [incidentType, setIncidentType] = useState<IncidentType>('Landslide');
  const [severity, setSeverity] = useState<IncidentSeverity>('Critical');
  const [description, setDescription] = useState('Massive rock and mudslide blocking both lanes at Paglapahar bend. Requires heavy earthmover.');
  const [gpsLocation, setGpsLocation] = useState('GPS: 25.8642° N, 93.7511° E (Paglapahar)');
  const [photoSelected, setPhotoSelected] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addOfflineReport({
      roadCode,
      incidentType,
      severity,
      description,
      location: gpsLocation,
      photoData: photoSelected ? 'camera_inspection_p1.jpg' : undefined
    });

    if (!isOnline) {
      setCurrentScreen('offline-queue');
    }
  };

  const handleSimulateGPS = () => {
    setGpsLocation('GPS: 25.8642° N, 93.7511° E (Accuracy: ±3m)');
    showToast('info', 'GPS Locked', 'High precision satellite fix acquired.');
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-12">
      
      {/* Mobile Top Header */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
            NER
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white">NER Logistics Field App</h2>
            <p className="text-[11px] text-slate-400">Road Inspector & Highway Patrol Unit</p>
          </div>
        </div>

        {/* Connectivity Switch */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
            isOnline
              ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
              : 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
          }`}
          title="Toggle online / offline mode"
        >
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              <span>OFFLINE MODE</span>
            </>
          )}
        </button>
      </div>

      {/* OFFLINE BANNER (IF DISCONNECTED) */}
      {!isOnline && (
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-950 text-xs shadow-sm flex items-start gap-3">
          <CloudOff className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold block text-sm text-amber-900">
              OFFLINE MODE ACTIVE
            </span>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              No cellular data detected. Your report will be encrypted, stored in local device cache, and automatically synchronized to State Command when network returns.
            </p>
          </div>
        </div>
      )}

      {/* INCIDENT REPORT FORM */}
      <div className="gov-card p-5 space-y-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Report Road Disruption
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit hazard coordinates, media proof, and structural clearance status
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Road Code */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Road Code / Corridor
            </label>
            <select
              value={roadCode}
              onChange={e => setRoadCode(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
            >
              {roads.map(r => (
                <option key={r.id} value={r.id}>
                  [{r.id}] {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type & Severity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Incident Type
              </label>
              <select
                value={incidentType}
                onChange={e => setIncidentType(e.target.value as IncidentType)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Landslide">Landslide</option>
                <option value="Flood">Flash Flood</option>
                <option value="Road Damage">Road Cavitation</option>
                <option value="Bridge Damage">Bridge Damage</option>
                <option value="Heavy Rainfall">Heavy Rainfall / Fog</option>
                <option value="Connectivity Loss">Connectivity Loss</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Hazard Severity
              </label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Critical">Critical (Total Closure)</option>
                <option value="Warning">Warning (Single Lane)</option>
                <option value="Info">Info (Caution Advised)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Field Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe debris volume, lane blockage, water depth..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Voice Input & Camera Photo Upload Simulator */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Multilingual Voice Report & Inspection Photo
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setDescription('Landslide at Paglapahar KM 42+300. Pavement completely buried.');
                  showToast('success', 'Voice Incident Transcribed', 'Transcribed audio input (Assamese/Nagamese) to structured report text.');
                }}
                className="p-3 rounded-lg border border-indigo-300 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 font-bold flex items-center justify-center gap-1.5 transition-all text-xs"
              >
                <Mic className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span>Voice Report (Mic)</span>
              </button>

              <button
                type="button"
                onClick={() => setPhotoSelected(!photoSelected)}
                className={`p-3 rounded-lg border flex items-center justify-center gap-1.5 transition-all text-xs ${
                  photoSelected
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Camera className="w-4 h-4 text-slate-700" />
                <span>{photoSelected ? 'Photo Captured ✓' : 'Capture Photo'}</span>
              </button>
            </div>
          </div>


          {/* Location & GPS Fix */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Geo-Location / Landmark
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={gpsLocation}
                onChange={e => setGpsLocation(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-800 text-xs"
                required
              />
              <button
                type="button"
                onClick={handleSimulateGPS}
                className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-300 flex items-center gap-1"
                title="Acquire GPS coordinates"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>GPS</span>
              </button>
            </div>
          </div>

          {/* Large Submit Button */}
          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl font-extrabold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-2 ${
              isOnline
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 active:scale-95'
                : 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20 active:scale-95'
            }`}
          >
            {isOnline ? (
              <>
                <Send className="w-4 h-4" />
                <span>SUBMIT LIVE REPORT TO COMMAND</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE REPORT OFFLINE (LOCAL QUEUE)</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <button
            onClick={() => setCurrentScreen('offline-queue')}
            className="text-blue-600 hover:underline font-bold"
          >
            View Offline Sync Queue →
          </button>
          <span>Offline sync powered by SQLite / IndexedDB</span>
        </div>
      </div>

    </div>
  );
};
