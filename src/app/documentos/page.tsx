import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { obtenerDocumentosVehiculo, obtenerVehiculoPrincipal } from '@/backend/services/datos.service';
import { DocumentosClientView } from '@/frontend/components/modules/documentos/documentos-client-view';

export const revalidate = 0;

export default async function DocumentosPage() {
  const vehiculo = await obtenerVehiculoPrincipal();
  const documentos = await obtenerDocumentosVehiculo(vehiculo.id);

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
              <h1 className="text-base font-bold text-white">Documentos Normativos</h1>
              <p className="text-xs text-slate-400">SOAT, Revisión Técnica y Brevete MTC</p>
            </div>
          </div>
          <div className="rounded-xl bg-purple-500/10 p-2 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-md px-4 py-4 space-y-4">
        <DocumentosClientView documentosIniciales={documentos} />
      </main>
    </div>
  );
}
