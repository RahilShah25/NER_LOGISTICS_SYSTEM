import React, { useState } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  AlertTriangle,
  MapPin,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  CornerDownRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendation?: {
    title: string;
    actionText: string;
    targetScreen: string;
    confidence: number;
    factors: { label: string; percent: number }[];
  };
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({ isOpen, onClose }) => {
  const { setCurrentScreen, roads, shipments, incidents } = useLogistics();
  const [inputQuery, setInputQuery] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am NER-LINK AI Assistant. I monitor 15 strategic corridors across 8 North-Eastern states in real-time. Ask me about blocked routes, hazard risk predictions, or alternate cargo dispatch routes.",
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    "Which routes are currently blocked?",
    "Find alternate route Guwahati → Imphal",
    "Which medicine shipments are delayed?",
    "High-risk landslide predictions for tomorrow"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Process query and return intelligent response
    setTimeout(() => {
      let aiResponseText = '';
      let recObj: ChatMessage['recommendation'] = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('blocked') || lower.includes('closed')) {
        const blockedRoads = roads.filter(r => r.status === 'BLOCKED');
        if (blockedRoads.length > 0) {
          aiResponseText = `Currently, ${blockedRoads.length} corridor is BLOCKED: ${blockedRoads.map(r => r.name).join(', ')}. Landslide debris at Paglapahar KM 42+300.`;
          recObj = {
            title: "Reroute Active Cargo via Wokha Bypass",
            actionText: "Open Route Planner",
            targetScreen: "route-planner",
            confidence: 94,
            factors: [
              { label: "Pavement Blockage", percent: 45 },
              { label: "Weather Saturation", percent: 30 },
              { label: "Bypass Capacity", percent: 25 }
            ]
          };
        } else {
          aiResponseText = "All major monitored corridors are currently open or operating under mild restrictions.";
        }
      } else if (lower.includes('alternate') || lower.includes('guwahati') || lower.includes('imphal')) {
        aiResponseText = "For Guwahati → Imphal transit, NH-29 via Paglapahar is blocked. AI recommends routed transit via NH-6 (Guwahati → Silchar) then NH-37 (Silchar → Imphal). Distance: 532 km. Risk: 18%.";
        recObj = {
          title: "Execute Cargo-Aware Reroute (Guwahati → Imphal)",
          actionText: "View Route Planner Results",
          targetScreen: "route-planner",
          confidence: 91,
          factors: [
            { label: "Road Accessibility", percent: 35 },
            { label: "Weather Safety", percent: 25 },
            { label: "Terrain Stability", percent: 20 },
            { label: "Travel Time", percent: 20 }
          ]
        };
      } else if (lower.includes('medicine') || lower.includes('delayed') || lower.includes('shipment')) {
        const reroutedOrDelayed = shipments.filter(s => s.status === 'REROUTED' || s.status === 'DELAYED');
        aiResponseText = `There are ${reroutedOrDelayed.length} priority shipments affected by corridor disruptions: ${reroutedOrDelayed.map(s => `${s.id} (${s.cargo})`).join(', ')}. All temperature-controlled cold-chain units remain within safe operating thresholds.`;
        recObj = {
          title: "Track Rerouted Medicine Cargo (NER-MED-102)",
          actionText: "View Fleet Intelligence",
          targetScreen: "shipments",
          confidence: 98,
          factors: [
            { label: "Telemetry GPS", percent: 50 },
            { label: "Driver Contact", percent: 30 },
            { label: "ETA Accuracy", percent: 20 }
          ]
        };
      } else {
        aiResponseText = `AI Analysis Complete: High precipitation detected in Meghalaya and Nagaland hills over the next 24 hours. Recommended precaution: Pre-position clearance earthmovers along NH-29 and NH-2 corridors.`;
        recObj = {
          title: "View 24-Hour AI Disruption Predictions",
          actionText: "Open Prediction Center",
          targetScreen: "disruptions",
          confidence: 88,
          factors: [
            { label: "IMD Rainfall Radar", percent: 40 },
            { label: "NESAC Slope Saturation", percent: 35 },
            { label: "Historical Landslides", percent: 25 }
          ]
        };
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendation: recObj
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 text-white flex flex-col h-full shadow-2xl overflow-hidden">
        
        {/* Copilot Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight">NER-LINK AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.4 Live
                </span>
              </div>
              <p className="text-xs text-slate-400">North-East Regional Decision Layer Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Chips */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-none shadow-lg'
                  }`}
                >
                  {msg.text}
                </div>

                {/* AI Structured Recommendation Box */}
                {msg.recommendation && (
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-indigo-500/20 pb-1.5">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        {msg.recommendation.title}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        {msg.recommendation.confidence}% Confidence
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Risk Factor Weights:</div>
                      {msg.recommendation.factors.map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                          <span>{f.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${f.percent}%` }}></div>
                            </div>
                            <span className="font-mono text-indigo-400 font-semibold">{f.percent}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setCurrentScreen(msg.recommendation!.targetScreen);
                        onClose();
                      }}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow duration-150"
                    >
                      <span>{msg.recommendation.actionText}</span>
                      <CornerDownRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className={`text-[10px] text-slate-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask NER-LINK AI about routes, disruptions, or fleets..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
