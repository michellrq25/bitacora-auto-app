'use client';

import React, { useState } from 'react';
import { Gauge, Edit3, Coins } from 'lucide-react';
import { Vehiculo } from '@/shared/types/vehiculo.types';
import { DocumentoConEstado } from '@/shared/types/documento.types';
import { Mantenimiento } from '@/shared/types/mantenimiento.types';
import { QuickOdometroModal } from '@/frontend/components/modules/dashboard/quick-odometro-modal';

interface DashboardClientViewProps {
  vehiculo: Vehiculo;
  alertaKm: {
    tieneAlerta: boolean;
    kmFaltantes: number;
    mensaje: string;
    esExcedido: boolean;
  };
  gastoTotal: number;
  ultimoMantenimiento: Mantenimiento | null;
  docsCriticos: DocumentoConEstado[];
}

export function DashboardClientView({
  vehiculo,
  alertaKm,
  gastoTotal,
  ultimoMantenimiento,
}: DashboardClientViewProps) {
  const [modalOdometroAbierto, setModalOdometroAbierto] = useState(false);

  return (
    <>
      {/* Tarjeta Hero Principal: Odómetro del Auto */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-sky-400">
              Odómetro Digital
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-white">
                {vehiculo.kilometraje_actual.toLocaleString('es-PE')}
              </span>
              <span className="text-sm font-bold text-sky-400">km</span>
            </div>
            <p className="text-xs text-slate-400">Lectura registrada del vehículo</p>
          </div>

          <button
            onClick={() => setModalOdometroAbierto(true)}
            className="flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 active:scale-95 transition-all shadow-sm"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Editar
          </button>
        </div>

        {/* Indicador de próximo cambio de aceite / servicio */}
        {ultimoMantenimiento?.proximo_servicio_km && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950/70 p-3 border border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <Gauge className="h-4 w-4 text-slate-400" />
              <span className="text-slate-400">Próximo servicio:</span>
              <span className="font-mono font-bold text-white">
                {ultimoMantenimiento.proximo_servicio_km.toLocaleString('es-PE')} km
              </span>
            </div>
            <div className="text-right">
              <span
                className={`text-xs font-bold ${
                  alertaKm.tieneAlerta
                    ? alertaKm.esExcedido
                      ? 'text-rose-400'
                      : 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {alertaKm.esExcedido
                  ? `+${Math.abs(alertaKm.kmFaltantes).toLocaleString('es-PE')} km`
                  : `-${alertaKm.kmFaltantes.toLocaleString('es-PE')} km`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Métricas Secundarias */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Inversión Total</span>
            <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400 border border-emerald-500/20">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-white">
            S/ {gastoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-400">En bitácora vehicular</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Último Aceite</span>
            <div className="rounded-lg bg-amber-500/10 p-1.5 text-amber-400">
              <Gauge className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-base font-bold text-amber-300 font-mono">
            {ultimoMantenimiento?.aceite_viscosidad || '5W-30'}
          </p>
          <span className="text-[10px] text-slate-400">
            {ultimoMantenimiento?.aceite_marca || 'Motul'} ({ultimoMantenimiento?.aceite_tipo || 'sintético'})
          </span>
        </div>
      </div>

      {/* Modal de edición rápida del Odómetro */}
      <QuickOdometroModal
        isOpen={modalOdometroAbierto}
        onClose={() => setModalOdometroAbierto(false)}
        vehiculoId={vehiculo.id}
        kilometrajeActual={vehiculo.kilometraje_actual}
      />
    </>
  );
}
