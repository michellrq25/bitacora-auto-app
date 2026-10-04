import React from 'react';
import Link from 'next/link';
import { PlusCircle, Wrench, ArrowLeft } from 'lucide-react';
import { obtenerMantenimientosVehiculo, obtenerVehiculoPrincipal } from '@/backend/services/datos.service';
import { MantenimientosClientView } from '@/frontend/components/modules/mantenimientos/mantenimientos-client-view';

export const revalidate = 0;

export default async function MantenimientosPage() {
  const vehiculo = await obtenerVehiculoPrincipal();
  const mantenimientos = await obtenerMantenimientosVehiculo(vehiculo.id);

  const gastoTotal = mantenimientos.reduce((acc, m) => acc + Number(m.costo || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-white">Historial de Mantenimientos</h1>
              <p className="text-xs text-slate-400">
                {mantenimientos.length} registros en bitácora
              </p>
            </div>
          </div>

          <Link
            href="/mantenimientos/nuevo"
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-sky-500/20 hover:from-sky-400 hover:to-blue-500 active:scale-95 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Nuevo
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-4 space-y-4">
        {/* Banner de Gasto Acumulado */}
        <div className="inversion-acumulada-card relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-sky-950/40 p-4 shadow-xl flex items-center justify-between transition-all">
          <div className="relative z-10 space-y-1">
            <span className="inversion-label text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Inversión Acumulada
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="inversion-currency font-sans text-lg font-bold text-sky-400">S/</span>
              <p className="inversion-amount font-mono text-3xl font-black tracking-tight text-white">
                {gastoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <p className="inversion-subtext text-[11px] text-slate-400">
              Total registrado en bitácora de servicios
            </p>
          </div>
          <div className="inversion-icon-box relative z-10 rounded-2xl bg-sky-500/15 p-3.5 text-sky-400 border border-sky-500/30 shadow-inner">
            <Wrench className="h-6 w-6" />
          </div>
        </div>

        {/* Vista interactiva de filtrado y tarjetas */}
        <MantenimientosClientView itemsIniciales={mantenimientos} />
      </main>
    </div>
  );
}
