import React, { useState } from 'react';
import {
  PhoneCall,
  MessageSquare,
  Radio,
  Copy,
  CheckCircle,
  Send,
  Sparkles,
  Shield,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export const SmsIvrHelpScreen: React.FC = () => {
  const { processSmsCommand, setIsSmsModalOpen, showToast } = useLogistics();

  const [inputCommand, setInputCommand] = useState('ROAD DIM-KOH-01 BLOCKED');
  const [outputLog, setOutputLog] = useState<string | null>(
    'Road status updated.\nCritical alert created.\nAffected shipments will be rerouted.\nCorridor DIM-KOH-01 marked BLOCKED.'
  );

  const handleTestCommand = (cmd: string) => {
    setInputCommand(cmd);
    const result = processSmsCommand(cmd);
    setOutputLog(result.response);
    showToast(result.success ? 'success' : 'error', 'SMS Processed', `Command executed via GSM gateway.`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('info', 'Copied to Clipboard', `Command "${text}" ready to send.`);
  };

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/10 text-blue-700">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Low-Connectivity SMS & IVR Access Layer
            </h1>
            <p className="text-xs text-slate-500">
              Enables field officers and highway patrols to query and alter corridor states via basic 2G feature phones
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSmsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Launch Floating SMS Console</span>
        </button>
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Command Reference Guide (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="gov-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Supported GSM / SMS Syntax</h3>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Gateway Shortcode: 51969
              </span>
            </div>

            {/* Command 1: STATUS */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                    STATUS &lt;ROAD_CODE&gt;
                  </span>
                  <span className="text-xs font-bold text-slate-700">Check Corridor Accessibility</span>
                </div>
                <button
                  onClick={() => handleTestCommand('STATUS DIM-KOH-01')}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Test Run →
                </button>
              </div>

              <div className="font-mono text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 flex justify-between items-center">
                <span>STATUS DIM-KOH-01</span>
                <button onClick={() => copyToClipboard('STATUS DIM-KOH-01')} className="text-slate-400 hover:text-slate-700">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-mono bg-slate-900 text-emerald-300 p-2.5 rounded whitespace-pre-line">
                {`DIM-KOH-01\nSTATUS: BLOCKED\nRISK: 91/100\nUPDATED: 14:28 IST`}
              </div>
            </div>

            {/* Command 2: ROAD <CODE> BLOCKED */}
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-rose-600 text-white px-2 py-0.5 rounded">
                    ROAD &lt;ROAD_CODE&gt; BLOCKED
                  </span>
                  <span className="text-xs font-bold text-rose-950">Declare Emergency Blockage</span>
                </div>
                <button
                  onClick={() => handleTestCommand('ROAD DIM-KOH-01 BLOCKED')}
                  className="text-xs text-rose-700 font-bold hover:underline"
                >
                  Test Run →
                </button>
              </div>

              <div className="font-mono text-xs text-slate-600 bg-white p-2 rounded border border-rose-200 flex justify-between items-center">
                <span>ROAD DIM-KOH-01 BLOCKED</span>
                <button onClick={() => copyToClipboard('ROAD DIM-KOH-01 BLOCKED')} className="text-slate-400 hover:text-slate-700">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-mono bg-slate-900 text-emerald-300 p-2.5 rounded whitespace-pre-line">
                {`Road status updated.\nCritical alert created.\nAffected shipments will be rerouted.\nCorridor DIM-KOH-01 marked BLOCKED.`}
              </div>
            </div>

            {/* Command 3: ROAD <CODE> OPEN */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">
                    ROAD &lt;ROAD_CODE&gt; OPEN
                  </span>
                  <span className="text-xs font-bold text-emerald-950">Confirm Debris Cleared</span>
                </div>
                <button
                  onClick={() => handleTestCommand('ROAD DIM-KOH-01 OPEN')}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  Test Run →
                </button>
              </div>

              <div className="font-mono text-xs text-slate-600 bg-white p-2 rounded border border-emerald-200 flex justify-between items-center">
                <span>ROAD DIM-KOH-01 OPEN</span>
                <button onClick={() => copyToClipboard('ROAD DIM-KOH-01 OPEN')} className="text-slate-400 hover:text-slate-700">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Live Interactive Sandbox Terminal (5 Cols) */}
        <div className="lg:col-span-5 gov-card p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Interactive Gateway Sandbox</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Live Gateway
              </span>
            </div>

            <p className="text-xs text-slate-500 my-2">
              Type custom SMS syntax or pick a quick command to test real-time state mutation:
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Inbound SMS Command:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputCommand}
                    onChange={e => setInputCommand(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleTestCommand(inputCommand)}
                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Run</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Automated Gateway Reply & State Response:
                </label>
                <div className="p-3 rounded-lg bg-slate-950 text-emerald-400 font-mono text-xs min-h-[120px] whitespace-pre-wrap shadow-inner border border-slate-800">
                  {outputLog || 'Enter command and click Run...'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
            <span className="font-bold block">Toll-Free IVR Phone Hotline:</span>
            Dial <strong>1800-345-LOGIS</strong> to report road blockages via interactive voice prompt in Hindi, English, and Assamese.
          </div>
        </div>

      </div>

    </div>
  );
};
