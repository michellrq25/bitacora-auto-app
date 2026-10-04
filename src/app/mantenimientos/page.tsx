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
      <div className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
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
      </div>

      <main className="mx-auto max-w-md px-4 py-4 space-y-4">
        {/* Banner de Gasto Acumulado */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-sky-950/30 p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Inversión Acumulada</span>
            <p className="text-2xl font-black text-white">
              S/ {gastoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400 border border-sky-500/20">
            <Wrench className="h-5 w-5" />
          </div>
        </div>

        {/* Vista interactiva de filtrado y tarjetas */}
        <MantenimientosClientView itemsIniciales={mantenimientos} />
      </main>
    </div>
  );
}
