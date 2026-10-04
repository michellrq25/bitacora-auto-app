'use client';

import React from 'react';
import Link from 'next/link';
import { Car, Bell } from 'lucide-react';
import { Vehiculo } from '@/shared/types/vehiculo.types';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  vehiculo: Vehiculo;
  alertasCount?: number;
}

export function Header({ vehiculo, alertasCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2.5">
        {/* Identidad del Vehículo */}
        <div className="flex items-center gap-2.5">
          {/* Emblema Automotriz con degradado azul y brillo sutil */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/40">
            <Car className="h-5 w-5 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              {/* Placa Oficial Estilo Perú */}
              <div className="placa-badge inline-flex flex-col items-center justify-center rounded-md border-2 border-slate-900 bg-white px-2 py-0.5 shadow-xs">
                <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-700 leading-none">
                  PERÚ
                </span>
                <span className="font-mono text-xs font-black tracking-wider text-slate-950 leading-tight">
                  {vehiculo.placa}
                </span>
              </div>

              {/* Estado Operativo del Auto */}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-400/60 dark:border-emerald-500/30 px-2 py-0.5 text-[10px] font-extrabold text-emerald-950 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operativo
              </span>
            </div>

            {/* Marca, Modelo y Año */}
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>{vehiculo.marca} {vehiculo.modelo}</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="font-medium text-slate-500 dark:text-slate-400">{vehiculo.anio}</span>
            </p>
          </div>
        </div>

        {/* Acciones Rápidas Derecha (Tema + Centro de Alertas) */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Botón de Campana: Centro de Notificaciones y Alertas */}
          <Link
            href="/documentos"
            className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:border-blue-300 dark:hover:border-slate-700 shadow-xs transition-all active:scale-95"
            title={
              alertasCount > 0
                ? `${alertasCount} alerta(s) de vencimiento pendiente(s). Toca para ver documentos.`
                : 'Alertas de Vencimiento (SOAT, CITV, Brevete)'
            }
            aria-label="Alertas de Vencimiento"
          >
            <Bell className="h-4 w-4 transition-transform group-hover:scale-110" />
            {alertasCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-950 animate-pulse">
                {alertasCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
