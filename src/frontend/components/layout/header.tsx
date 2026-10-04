'use client';

import React from 'react';
import Link from 'next/link';
import { Car, BellRing } from 'lucide-react';
import { Vehiculo } from '@/shared/types/vehiculo.types';

interface HeaderProps {
  vehiculo: Vehiculo;
}

export function Header({ vehiculo }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/10 border border-sky-500/30 text-sky-400">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-bold tracking-wider text-white bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700">
                {vehiculo.placa}
              </span>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Activo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
            </p>
          </div>
        </div>

        <Link
          href="/documentos"
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-sky-400 transition-colors"
          title="Ver alertas y documentos"
        >
          <BellRing className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
