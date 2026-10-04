'use client';

import React from 'react';
import { DocumentoConEstado } from '@/shared/types/documento.types';
import { BadgeSemaforo } from '@/frontend/components/ui/badge-semaforo';
import { Calendar, RefreshCw, FileText, Building2, User, Car } from 'lucide-react';

interface DocumentoCardProps {
  documento: DocumentoConEstado;
  onRenovar: (doc: DocumentoConEstado) => void;
}

export function DocumentoCard({ documento, onRenovar }: DocumentoCardProps) {
  const isVencido = documento.estado_semaforo === 'rojo';
  const isAmarillo = documento.estado_semaforo === 'amarillo';

  const borderClass = isVencido
    ? 'border-2 border-rose-300 bg-rose-50/70 dark:border-rose-500/40 dark:bg-rose-950/15'
    : isAmarillo
    ? 'border-2 border-amber-300 bg-amber-50/70 dark:border-amber-500/40 dark:bg-amber-950/15'
    : 'border-2 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60';

  return (
    <div
      className={`rounded-xl p-3 shadow-xs backdrop-blur-sm transition-all hover:shadow-md ${borderClass}`}
    >
      {/* Fila superior: Badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {documento.responsable === 'auto' ? (
            <span className="doc-responsable-auto flex items-center gap-1 text-[11px] font-bold text-sky-900 bg-sky-100 border border-sky-300 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20 px-2 py-0.5 rounded-full shrink-0">
              <Car className="h-3 w-3" /> Auto
            </span>
          ) : (
            <span className="doc-responsable-conductor flex items-center gap-1 text-[11px] font-bold text-purple-900 bg-purple-100 border border-purple-300 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20 px-2 py-0.5 rounded-full shrink-0">
              <User className="h-3 w-3" /> Conductor
            </span>
          )}
          <BadgeSemaforo
            estado={documento.estado_semaforo}
            texto={documento.estado_etiqueta}
            size="sm"
          />
        </div>
      </div>

      {/* Título en UNA SOLA LÍNEA */}
      <h4
        className="text-sm font-extrabold text-slate-900 dark:text-white pt-1.5 truncate whitespace-nowrap block"
        title={documento.nombre_identificador}
      >
        {documento.nombre_identificador}
      </h4>

      {/* Datos: N° y Emisor en líneas separadas */}
      <div className="mt-2 border-t border-slate-200 dark:border-slate-800/60 pt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300">
        {documento.numero_documento && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
            <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">N°:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {documento.numero_documento}
            </span>
          </div>
        )}

        {documento.entidad_emisora && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">Emisor:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {documento.entidad_emisora}
            </span>
          </div>
        )}

        {/* Fila de Vencimiento y Botón Renovar */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold text-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Vence:</span>
            <span
              className={`doc-vence-fecha font-mono font-black ${
                isVencido
                  ? 'text-rose-700 dark:text-rose-400'
                  : isAmarillo
                  ? 'text-amber-800 dark:text-amber-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {documento.fecha_vencimiento}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onRenovar(documento)}
            className="btn-renovar-doc inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-[11px] px-3 py-1 shadow-sm active:scale-95 transition-all border border-blue-400/40 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="h-3 w-3 text-white stroke-[2.5]" />
            <span className="text-white font-black">Renovar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
