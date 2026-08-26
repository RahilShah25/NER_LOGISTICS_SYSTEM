import React, { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: number | string;
  subtext: string;
  icon: ReactNode;
  variant?: 'green' | 'amber' | 'red' | 'orange' | 'blue' | 'purple' | 'slate';
  onClick?: () => void;
  badgeText?: string;
  trend?: 'up' | 'down' | 'neutral' | 'alert';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  icon,
  variant = 'blue',
  onClick,
  badgeText,
  trend
}) => {
  const variantStyles = {
    green: {
      bg: 'bg-emerald-50/70 hover:bg-emerald-50',
      border: 'border-emerald-200 hover:border-emerald-300',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-700',
      numColor: 'text-emerald-950',
      subColor: 'text-emerald-700'
    },
    amber: {
      bg: 'bg-amber-50/70 hover:bg-amber-50',
      border: 'border-amber-200 hover:border-amber-300',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100 text-amber-800',
      numColor: 'text-amber-950',
      subColor: 'text-amber-700'
    },
    red: {
      bg: 'bg-rose-50/70 hover:bg-rose-50',
      border: 'border-rose-200 hover:border-rose-300',
      text: 'text-rose-700',
      iconBg: 'bg-rose-100 text-rose-700',
      numColor: 'text-rose-950',
      subColor: 'text-rose-700'
    },
    orange: {
      bg: 'bg-orange-50/70 hover:bg-orange-50',
      border: 'border-orange-200 hover:border-orange-300',
      text: 'text-orange-700',
      iconBg: 'bg-orange-100 text-orange-800',
      numColor: 'text-orange-950',
      subColor: 'text-orange-700'
    },
    blue: {
      bg: 'bg-blue-50/70 hover:bg-blue-50',
      border: 'border-blue-200 hover:border-blue-300',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100 text-blue-700',
      numColor: 'text-blue-950',
      subColor: 'text-blue-700'
    },
    purple: {
      bg: 'bg-purple-50/70 hover:bg-purple-50',
      border: 'border-purple-200 hover:border-purple-300',
      text: 'text-purple-700',
      iconBg: 'bg-purple-100 text-purple-700',
      numColor: 'text-purple-950',
      subColor: 'text-purple-700'
    },
    slate: {
      bg: 'bg-slate-50 hover:bg-slate-100/70',
      border: 'border-slate-200 hover:border-slate-300',
      text: 'text-slate-700',
      iconBg: 'bg-slate-200 text-slate-700',
      numColor: 'text-slate-900',
      subColor: 'text-slate-600'
    }
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border bg-white shadow-sm transition-all duration-150 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${variantStyles.border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 line-clamp-1">
          {label}
        </span>
        <div className={`p-2 rounded-lg flex-shrink-0 ${variantStyles.iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${variantStyles.numColor}`}>
          {value}
        </span>
        {badgeText && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className={`font-medium ${variantStyles.subColor}`}>
          {subtext}
        </span>
      </div>
    </div>
  );
};
