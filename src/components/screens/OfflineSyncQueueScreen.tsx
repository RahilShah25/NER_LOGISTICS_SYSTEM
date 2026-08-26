import React from 'react';
import {
  CloudOff,
  RefreshCw,
  CheckCircle2,
  Clock,
  Wifi,
  WifiOff,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  UploadCloud
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../common/StatusBadge';

export const OfflineSyncQueueScreen: React.FC = () => {
  const {
    offlineReports,
    syncOfflineReports,
    clearOfflineQueue,
    isOnline,
    setIsOnline,
    setCurrentScreen,
    showToast
  } = useLogistics();

  const pendingReports = offlineReports.filter(r => r.syncStatus === 'pending');
  const syncedReports = offlineReports.filter(r => r.syncStatus === 'synced');

  const handleManualSync = () => {
    if (!isOnline) {
      showToast('warning', 'Cannot Synchronize', 'Device is in Offline Mode. Switch to Online to sync with State Command.');
      return;
    }
    syncOfflineReports();
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-base text-white">Offline Report Queue</h1>
          <p className="text-[11px] text-slate-400">Local device persistent cache & sync engine</p>
        </div>

        {/* Online / Offline Toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
            isOnline
              ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
              : 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE</span>
            </>
          )}
        </button>
      </div>

      {/* SYNC STATUS BAR */}
      <div className="gov-card p-4 flex items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-900 block text-sm">
            {pendingReports.length} Pending Synchronization
          </span>
          <span className="text-slate-500 text-[11px]">
            {syncedReports.length} reports successfully pushed to State Command
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSync}
            disabled={pendingReports.length === 0}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Sync Now</span>
          </button>
        </div>
      </div>

      {/* QUEUED REPORTS LIST */}
      <div className="space-y-3">
        {offlineReports.length === 0 ? (
          <div className="gov-card p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <span className="font-bold text-slate-800 text-sm block">Queue Clean</span>
            No offline reports pending or recorded on this device.
          </div>
        ) : (
          offlineReports.map(report => (
            <div
              key={report.id}
              className={`gov-card p-4 transition-all shadow-sm space-y-2 border-l-4 ${
                report.syncStatus === 'synced'
                  ? 'border-l-emerald-500 bg-emerald-50/20'
                  : 'border-l-amber-500 bg-amber-50/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {report.id}
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-900">
                    {report.roadCode}
                  </span>
                </div>

                {report.syncStatus === 'synced' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Synced ✓</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Sync</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-900">{report.incidentType}</span>
                <StatusBadge status={report.severity} size="sm" />
                <span className="text-[10px] text-slate-400 font-mono ml-auto">{report.createdAt}</span>
              </div>

              <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                {report.description}
              </p>

              <div className="text-[11px] text-slate-500 font-mono">
                {report.location}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Footer */}
      {offlineReports.length > 0 && (
        <div className="flex items-center justify-between text-xs pt-2">
          <button
            onClick={clearOfflineQueue}
            className="text-rose-600 hover:underline font-semibold flex items-center gap-1 text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Storage Queue</span>
          </button>

          <button
            onClick={() => setCurrentScreen('field-report')}
            className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1"
          >
            <span>+ Add Another Report</span>
          </button>
        </div>
      )}

    </div>
  );
};
