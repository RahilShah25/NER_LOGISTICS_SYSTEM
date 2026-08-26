import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { DeviceView } from '../../types';

export const DeviceFrameToggle: React.FC = () => {
  const { deviceView, setDeviceView } = useLogistics();

  const options: { id: DeviceView; label: string; icon: React.ReactNode }[] = [
    { id: 'desktop', label: 'Command Center (1440px)', icon: <Monitor className="w-3.5 h-3.5" /> },
    { id: 'tablet', label: 'Tablet (1024px)', icon: <Tablet className="w-3.5 h-3.5" /> },
    { id: 'mobile', label: 'Field Mobile (390px)', icon: <Smartphone className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="hidden xl:flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs shadow-inner">
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => setDeviceView(opt.id)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold transition-all ${
            deviceView === opt.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title={opt.label}
        >
          {opt.icon}
          <span className="text-[11px]">{opt.id === 'desktop' ? 'Desktop' : opt.id === 'tablet' ? 'Tablet' : 'Mobile View'}</span>
        </button>
      ))}
    </div>
  );
};
