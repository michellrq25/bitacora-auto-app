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
    ? 'border-rose-500/40 bg-rose-950/15'
    : isAmarillo
    ? 'border-amber-500/40 bg-amber-950/15'
    : 'border-slate-800 bg-slate-900/60';

  return (
    <div
      className={`rounded-2xl border p-4 shadow-md backdrop-blur-sm transition-all hover:border-slate-700 ${borderClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            {documento.responsable === 'auto' ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                <Car className="h-3 w-3" /> Auto
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                <User className="h-3 w-3" /> Conductor
              </span>
            )}
            <BadgeSemaforo
              estado={documento.estado_semaforo}
              texto={documento.estado_etiqueta}
              size="sm"
            />
          </div>
          <h4 className="text-base font-semibold text-white pt-1">
            {documento.nombre_identificador}
          </h4>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 border-t border-slate-800/60 pt-3 text-xs text-slate-300">
        {documento.numero_documento && (
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400">N°:</span>
            <span className="font-mono font-medium text-white">
              {documento.numero_documento}
            </span>
          </div>
        )}

        {documento.entidad_emisora && (
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400">Emisor:</span>
            <span className="text-slate-200">{documento.entidad_emisora}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>Vence:</span>
            <span
              className={`font-semibold ${
                isVencido
                  ? 'text-rose-400'
                  : isAmarillo
                  ? 'text-amber-300'
                  : 'text-emerald-400'
              }`}
            >
              {documento.fecha_vencimiento}
            </span>
          </div>

          <button
            onClick={() => onRenovar(documento)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-sky-500 hover:text-sky-300 active:scale-95 transition-all shadow"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Renovar
          </button>
        </div>
      </div>
    </div>
  );
}
