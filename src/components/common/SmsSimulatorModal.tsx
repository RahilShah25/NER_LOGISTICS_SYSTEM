import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Phone,
  Radio,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Copy,
  Sparkles
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

interface Message {
  sender: 'user' | 'system';
  text: string;
  time: string;
  isError?: boolean;
}

export const SmsSimulatorModal: React.FC = () => {
  const { isSmsModalOpen, setIsSmsModalOpen, processSmsCommand, roads } = useLogistics();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'system',
      text: 'NER GOVT LOGISTICS SMS/IVR GATEWAY [Shortcode: 51969]\nSend "STATUS <ROAD_CODE>" or "ROAD <CODE> BLOCKED/OPEN" to report or check corridor access.',
      time: '14:00 IST'
    }
  ]);

  if (!isSmsModalOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    
    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: query,
      time: timeNow
    };

    // Process through decision layer
    const result = processSmsCommand(query);

    const systemMsg: Message = {
      sender: 'system',
      text: result.response,
      time: timeNow,
      isError: !result.success
    };

    setMessages(prev => [...prev, userMsg, systemMsg]);
    setInputText('');
  };

  const quickCommands = [
    'ROAD DIM-KOH-01 BLOCKED',
    'STATUS DIM-KOH-01',
    'ROAD DIM-KOH-01 OPEN',
    'STATUS KOH-WOK-02',
    'ROAD SIL-IMP-04 RESTRICTED',
    'STATUS SIL-IMP-04'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/30 border border-blue-500/50 text-blue-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Low-Connectivity SMS & IVR Terminal</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-600 text-emerald-300">
                  GSM Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Simulate field SMS commands without internet access</p>
            </div>
          </div>
          <button
            onClick={() => setIsSmsModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Chips */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Quick Test Commands:</span>
            <span className="text-amber-400 text-[10px]">Click to execute directly</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickCommands.map(cmd => (
              <button
                key={cmd}
                onClick={() => handleSend(cmd)}
                className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-blue-900/60 border border-slate-700 hover:border-blue-500 text-slate-200 hover:text-blue-200 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/60 font-sans text-xs">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 whitespace-pre-wrap leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-mono rounded-br-none shadow-md'
                    : msg.isError
                    ? 'bg-rose-950 border border-rose-800 text-rose-200 font-mono rounded-bl-none'
                    : 'bg-slate-800 border border-slate-700 text-slate-200 font-mono rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Message Input Form */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="e.g. ROAD DIM-KOH-01 BLOCKED or STATUS DIM-KOH-01"
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send SMS</span>
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>Standard Shortcode: 51969 | Format: ROAD &lt;CODE&gt; &lt;STATUS&gt;</span>
            <span className="text-emerald-400 font-semibold">Zero Data/2G Capable</span>
          </div>
        </div>

      </div>
    </div>
  );
};
