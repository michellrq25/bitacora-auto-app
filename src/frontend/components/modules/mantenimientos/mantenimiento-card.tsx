import React from 'react';
import { Mantenimiento } from '@/shared/types/mantenimiento.types';
import {
  Droplets,
  Disc,
  Zap,
  Thermometer,
  Wrench,
  ShieldAlert,
  Calendar,
  Gauge,
  Store,
  ArrowRight,
} from 'lucide-react';

interface MantenimientoCardProps {
  item: Mantenimiento;
}

const CATEGORIA_ICONS = {
  aceite: Droplets,
  frenos: ShieldAlert,
  neumaticos: Disc,
  bateria: Zap,
  refrigeracion: Thermometer,
  general: Wrench,
};

const CATEGORIA_LABELS: Record<string, string> = {
  aceite: 'Cambio de Aceite',
  frenos: 'Frenos y Discos',
  neumaticos: 'Neumáticos',
  bateria: 'Batería y Eléctrico',
  refrigeracion: 'Refrigeración',
  general: 'Mantenimiento General',
};

const CATEGORIA_THEMES: Record<
  string,
  {
    iconBox: string;
    accent: string;
  }
> = {
  aceite: {
    iconBox: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-amber-500/10',
    accent: 'text-amber-400',
  },
  frenos: {
    iconBox: 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-rose-500/10',
    accent: 'text-rose-400',
  },
  neumaticos: {
    iconBox: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10',
    accent: 'text-emerald-400',
  },
  bateria: {
    iconBox: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-cyan-500/10',
    accent: 'text-cyan-400',
  },
  refrigeracion: {
    iconBox: 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sky-500/10',
    accent: 'text-sky-400',
  },
  general: {
    iconBox: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-indigo-500/10',
    accent: 'text-indigo-400',
  },
};

export function MantenimientoCard({ item }: MantenimientoCardProps) {
  const Icon = CATEGORIA_ICONS[item.categoria] || Wrench;
  const isAceite = item.categoria === 'aceite';
  const theme = CATEGORIA_THEMES[item.categoria] || CATEGORIA_THEMES.general;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/80 p-4 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/95">
      {/* Encabezado: Icono, Título, Badges y Monto */}
      <div className="flex items-start justify-between gap-3">
        {/* Lado izquierdo: Icono + Información */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`rounded-xl p-2.5 shrink-0 shadow-sm ${theme.iconBox}`}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                {CATEGORIA_LABELS[item.categoria] || item.categoria}
              </h3>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase border ${
                  item.tipo === 'preventivo'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                {item.tipo}
              </span>
            </div>

            {/* Fecha y Kilometraje con separador */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                {item.fecha}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="flex items-center gap-1.5 font-mono text-slate-300 font-medium">
                <Gauge className="h-3.5 w-3.5 text-slate-500" />
                {item.kilometraje.toLocaleString('es-PE')} km
              </span>
            </div>
          </div>
        </div>

        {/* Lado derecho: Monto Total estilizado estilo tarjeta bancaria / recibo */}
        <div className="shrink-0 rounded-xl bg-slate-950/70 border border-slate-800/80 px-3 py-1.5 text-right shadow-inner">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total
          </span>
          <div className="text-base font-extrabold text-white tracking-tight whitespace-nowrap flex items-baseline justify-end gap-1 font-mono">
            <span className="text-xs font-bold text-sky-400 font-sans">S/</span>
            <span>{Number(item.costo).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Detalle técnico de lubricante (si corresponde a Aceite) */}
      {isAceite && (item.aceite_marca || item.aceite_viscosidad) && (
        <div className="mt-3 rounded-xl border-2 border-amber-300 dark:border-amber-500/25 bg-amber-50/80 dark:bg-gradient-to-r dark:from-amber-500/10 dark:via-amber-500/5 dark:to-transparent p-2.5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-extrabold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              {item.aceite_marca} {item.aceite_modelo || ''}
            </span>
            <div className="flex items-center gap-1.5">
              {item.aceite_viscosidad && (
                <span className="aceite-viscosidad-badge rounded-md bg-amber-100 dark:bg-amber-500/20 border border-amber-400 dark:border-amber-500/30 px-2 py-0.5 font-mono font-black text-amber-950 dark:text-amber-200 text-xs shadow-xs">
                  {item.aceite_viscosidad}
                </span>
              )}
              {item.aceite_tipo && (
                <span className="aceite-tipo-badge rounded-md bg-sky-100 dark:bg-slate-800/90 border border-sky-400 dark:border-slate-700 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-sky-950 dark:text-sky-300 shadow-xs">
                  {item.aceite_tipo}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Taller y Notas con contenedor limpio */}
      {(item.taller || item.notas) && (
        <div className="mt-3 rounded-xl bg-slate-950/50 border border-slate-800/70 p-2.5 space-y-1.5 text-xs">
          {item.taller && (
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Store className="h-3.5 w-3.5 text-sky-400 shrink-0" />
              <span className="line-clamp-1">{item.taller}</span>
            </div>
          )}
          {item.notas && (
            <p className="text-slate-400 italic text-[11px] leading-relaxed pl-5 border-l-2 border-slate-700/60 ml-0.5 line-clamp-2">
              {item.notas}
            </p>
          )}
        </div>
      )}

      {/* Próximo Servicio Programado */}
      {(item.proximo_servicio_km || item.proximo_servicio_fecha) && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-gradient-to-r from-sky-950/40 to-slate-950/50 px-3 py-2 text-xs border border-sky-500/25">
          <span className="text-sky-300/90 flex items-center gap-1.5 font-medium">
            <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
            Próximo servicio:
          </span>
          <div className="flex items-center gap-2 font-medium">
            {item.proximo_servicio_km && (
              <span className="text-sky-300 font-mono font-bold">
                {item.proximo_servicio_km.toLocaleString('es-PE')} km
              </span>
            )}
            {item.proximo_servicio_fecha && (
              <span className="text-slate-400 text-[11px]">({item.proximo_servicio_fecha})</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
