import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  OctagonX,
  Zap,
  HelpCircle,
  Clock,
  RotateCcw,
  CheckCircle,
  WifiOff,
  Info,
  ShieldAlert
} from 'lucide-react';
import { RoadStatus, ShipmentStatus, IncidentSeverity } from '../../types';

interface StatusBadgeProps {
  status: RoadStatus | ShipmentStatus | IncidentSeverity | 'OFFLINE' | 'ONLINE' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  showIcon = true
}) => {
  const norm = status?.toUpperCase() || 'UNKNOWN';

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold'
  }[size];

  // Road Statuses
  if (norm === 'OPEN') {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm ${sizeClasses} ${className}`}>
        {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
        <span>OPEN</span>
      </span>
    );
  }

  if (norm === 'RESTRICTED') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-900 border border-amber-300 shadow-sm ${sizeClasses} ${className}`}>
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />}
        <span>RESTRICTED</span>
      </span>
    );
  }

  if (norm === 'BLOCKED') {
    return (
      <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-900 border border-rose-400 shadow-sm animate-pulse-slow ${sizeClasses} ${className}`}>
        {showIcon && <OctagonX className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />}
        <span>BLOCKED</span>
      </span>
    );
  }

  if (norm === 'HIGH_RISK' || norm === 'HIGH RISK') {
    return (
      <span className={`inline-flex items-center rounded-full bg-orange-50 text-orange-900 border border-orange-300 shadow-sm ${sizeClasses} ${className}`}>
        {showIcon && <Zap className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />}
        <span>HIGH RISK</span>
      </span>
    );
  }

  // Shipment Statuses
  if (norm === 'REROUTED') {
    return (
      <span className={`inline-flex items-center rounded-full bg-purple-50 text-purple-900 border border-purple-300 shadow-sm ${sizeClasses} ${className}`}>
        {showIcon && <RotateCcw className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />}
        <span>REROUTED</span>
      </span>
    );
  }

  if (norm === 'IN TRANSIT') {
    return (
      <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-900 border border-blue-300 shadow-sm ${sizeClasses} ${className}`}>
        {showIcon && <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
        <span>IN TRANSIT</span>
      </span>
    );
  }

  if (norm === 'DELAYED') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-900 border border-amber-300 shadow-sm ${sizeClasses} ${className}`}>
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />}
        <span>DELAYED</span>
      </span>
    );
  }

  if (norm === 'DELIVERED') {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-sm ${sizeClasses} ${className}`}>
        {showIcon && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
        <span>DELIVERED</span>
      </span>
    );
  }

  // Severities
  if (norm === 'CRITICAL') {
    return (
      <span className={`inline-flex items-center rounded-full bg-rose-100 text-rose-900 border border-rose-400 font-bold ${sizeClasses} ${className}`}>
        {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />}
        <span>CRITICAL</span>
      </span>
    );
  }

  if (norm === 'WARNING') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold ${sizeClasses} ${className}`}>
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />}
        <span>WARNING</span>
      </span>
    );
  }

  if (norm === 'INFO') {
    return (
      <span className={`inline-flex items-center rounded-full bg-sky-50 text-sky-900 border border-sky-300 font-semibold ${sizeClasses} ${className}`}>
        {showIcon && <Info className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />}
        <span>INFO</span>
      </span>
    );
  }

  // Connectivity
  if (norm === 'OFFLINE') {
    return (
      <span className={`inline-flex items-center rounded-full bg-slate-200 text-slate-800 border border-slate-300 ${sizeClasses} ${className}`}>
        {showIcon && <WifiOff className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />}
        <span>OFFLINE</span>
      </span>
    );
  }

  // Fallback
  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses} ${className}`}>
      {showIcon && <HelpCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
      <span>{norm}</span>
    </span>
  );
};
