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

export function MantenimientoCard({ item }: MantenimientoCardProps) {
  const Icon = CATEGORIA_ICONS[item.categoria] || Wrench;
  const isAceite = item.categoria === 'aceite';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-md transition-all hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`rounded-xl p-2.5 ${
              isAceite
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {CATEGORIA_LABELS[item.categoria] || item.categoria}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  item.tipo === 'preventivo'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {item.tipo}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                {item.fecha}
              </span>
              <span className="flex items-center gap-1 font-mono text-slate-300">
                <Gauge className="h-3.5 w-3.5 text-slate-500" />
                {item.kilometraje.toLocaleString('es-PE')} km
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Total</span>
          <p className="text-base font-bold text-white">
            S/ {Number(item.costo).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Detalle técnico de aceite si corresponde */}
      {isAceite && (item.aceite_marca || item.aceite_viscosidad) && (
        <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-300 flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5" />
              {item.aceite_marca} {item.aceite_modelo || ''}
            </span>
            <div className="flex items-center gap-1.5">
              {item.aceite_viscosidad && (
                <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono font-bold text-amber-200">
                  {item.aceite_viscosidad}
                </span>
              )}
              {item.aceite_tipo && (
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase text-slate-300">
                  {item.aceite_tipo}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Taller y notas */}
      {(item.taller || item.notas) && (
        <div className="mt-3 space-y-1 border-t border-slate-800/60 pt-2.5 text-xs text-slate-400">
          {item.taller && (
            <div className="flex items-center gap-1.5 text-slate-300">
              <Store className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="line-clamp-1">{item.taller}</span>
            </div>
          )}
          {item.notas && <p className="italic text-slate-400 line-clamp-2">"{item.notas}"</p>}
        </div>
      )}

      {/* Próximo Servicio Programado */}
      {(item.proximo_servicio_km || item.proximo_servicio_fecha) && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300 border border-slate-800/80">
          <span className="text-slate-400 flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
            Próximo servicio:
          </span>
          <div className="flex items-center gap-2 font-medium">
            {item.proximo_servicio_km && (
              <span className="text-sky-300 font-mono">
                {item.proximo_servicio_km.toLocaleString('es-PE')} km
              </span>
            )}
            {item.proximo_servicio_fecha && (
              <span className="text-slate-400">({item.proximo_servicio_fecha})</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
