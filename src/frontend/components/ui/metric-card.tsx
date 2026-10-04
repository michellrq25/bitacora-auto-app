import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'default' | 'alert' | 'success' | 'warning';
  actionButton?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
  actionButton,
}: MetricCardProps) {
  const borderStyles = {
    default: 'border-slate-800 bg-slate-900/80 text-slate-100',
    alert: 'border-rose-500/40 bg-rose-950/20 text-rose-100',
    warning: 'border-amber-500/40 bg-amber-950/20 text-amber-100',
    success: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-100',
  };

  const iconColors = {
    default: 'text-sky-400 bg-sky-500/10',
    alert: 'text-rose-400 bg-rose-500/10',
    warning: 'text-amber-400 bg-amber-500/10',
    success: 'text-emerald-400 bg-emerald-500/10',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-lg backdrop-blur-md transition-all ${borderStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              {value}
            </span>
          </div>
          {subtext && (
            <p className="text-xs text-slate-400 line-clamp-1">{subtext}</p>
          )}
        </div>
        <div className={`rounded-xl p-2.5 ${iconColors[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {actionButton && <div className="mt-3 pt-2 border-t border-slate-800/60">{actionButton}</div>}
    </div>
  );
}
