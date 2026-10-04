import React from 'react';
import Link from 'next/link';
import {
  Gauge,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  PlusCircle,
  Wrench,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { obtenerEstadoGeneralApp } from '@/backend/services/datos.service';
import { Header } from '@/frontend/components/layout/header';
import { DashboardClientView } from '@/frontend/components/modules/dashboard/dashboard-client-view';

export const revalidate = 0; // Datos frescos siempre

export default async function HomePage() {
  const {
    vehiculo,
    documentos,
    mantenimientos,
    alertaKm,
    docsCriticos,
    gastoTotal,
    ultimoMantenimiento,
  } = await obtenerEstadoGeneralApp();

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100">
      <Header vehiculo={vehiculo} />

      <main className="mx-auto max-w-md px-4 py-4 space-y-4">
        {/* Odómetro interactivo y métricas clave */}
        <DashboardClientView
          vehiculo={vehiculo}
          alertaKm={alertaKm}
          gastoTotal={gastoTotal}
          ultimoMantenimiento={ultimoMantenimiento}
          docsCriticos={docsCriticos}
        />

        {/* Banner de Alerta Crítica (si hay documentos por vencer o odómetro próximo) */}
        {(docsCriticos.length > 0 || alertaKm.tieneAlerta) && (
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-rose-500/10 p-4 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
              <AlertTriangle className="h-4 w-4 shrink-0 animate-bounce" />
              <span>Atención Requerida</span>
            </div>

            <div className="space-y-2 text-xs">
              {alertaKm.tieneAlerta && (
                <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5 border border-amber-500/20">
                  <span className="text-amber-200">{alertaKm.mensaje}</span>
                  <Link
                    href="/mantenimientos/nuevo"
                    className="font-semibold text-sky-400 hover:underline"
                  >
                    Atender
                  </Link>
                </div>
              )}

              {docsCriticos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5 border border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        doc.estado_semaforo === 'rojo'
                          ? 'bg-rose-500'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span className="font-medium text-slate-200">
                      {doc.nombre_identificador}
                    </span>
                  </div>
                  <span
                    className={`font-semibold ${
                      doc.estado_semaforo === 'rojo'
                        ? 'text-rose-400'
                        : 'text-amber-300'
                    }`}
                  >
                    {doc.estado_etiqueta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acceso Rápido de Acciones */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Link
            href="/mantenimientos/nuevo"
            className="group flex flex-col justify-between rounded-2xl border border-sky-500/30 bg-gradient-to-b from-sky-500/15 to-blue-600/5 p-4 transition-all hover:border-sky-500 active:scale-95 shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-bold text-white group-hover:text-sky-300">
                Registrar Servicio
              </h4>
              <p className="text-[11px] text-slate-400">Aceite, filtros o frenos</p>
            </div>
          </Link>

          <Link
            href="/documentos"
            className="group flex flex-col justify-between rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-500/15 to-indigo-600/5 p-4 transition-all hover:border-purple-500 active:scale-95 shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-bold text-white group-hover:text-purple-300">
                SOAT & Brevete
              </h4>
              <p className="text-[11px] text-slate-400">Control de vigencias</p>
            </div>
          </Link>
        </div>

        {/* Resumen de Último Servicio Realizado */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-sky-400" />
              Último Servicio Registrado
            </h3>
            <Link
              href="/mantenimientos"
              className="text-xs font-semibold text-sky-400 flex items-center gap-0.5 hover:underline"
            >
              Ver todos <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {ultimoMantenimiento ? (
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-white">
                <span className="capitalize">
                  {ultimoMantenimiento.categoria === 'aceite'
                    ? `Cambio de Aceite (${ultimoMantenimiento.aceite_viscosidad || 'SAE'})`
                    : ultimoMantenimiento.categoria}
                </span>
                <span className="text-sky-300">
                  S/ {Number(ultimoMantenimiento.costo).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>{ultimoMantenimiento.fecha}</span>
                <span className="font-mono">
                  {ultimoMantenimiento.kilometraje.toLocaleString('es-PE')} km
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-2">
              No hay servicios registrados en la bitácora aún.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
