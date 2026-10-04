'use client';

import React, { useState } from 'react';
import { DocumentoConEstado, ResponsableDocumento } from '@/shared/types/documento.types';
import { DocumentoCard } from '@/frontend/components/modules/documentos/documento-card';
import { ModalRenovacion } from '@/frontend/components/modules/documentos/modal-renovacion';
import { enviarAlertaManualAction } from '@/backend/actions/notificacion.actions';
import { Car, User, BellRing, Check, Loader2 } from 'lucide-react';

interface DocumentosClientViewProps {
  documentosIniciales: DocumentoConEstado[];
}

export function DocumentosClientView({ documentosIniciales }: DocumentosClientViewProps) {
  const [tab, setTab] = useState<ResponsableDocumento>('auto');
  const [docParaRenovar, setDocParaRenovar] = useState<DocumentoConEstado | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estado para prueba de Telegram
  const [enviandoTelegram, setEnviandoTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);

  const docsFiltrados = documentosIniciales.filter((d) => d.responsable === tab);

  const contarCriticos = (resp: ResponsableDocumento) =>
    documentosIniciales.filter(
      (d) => d.responsable === resp && (d.estado_semaforo === 'amarillo' || d.estado_semaforo === 'rojo')
    ).length;

  const criticosAuto = contarCriticos('auto');
  const criticosConductor = contarCriticos('conductor');

  const handleProbarTelegram = async () => {
    setEnviandoTelegram(true);
    setTelegramStatus(null);
    try {
      const res = await enviarAlertaManualAction();
      if (res.success) {
        setTelegramStatus(res.message || '¡Reporte enviado exitosamente a Telegram!');
      } else {
        setTelegramStatus(`Aviso: ${res.error || 'Error al conectar'}`);
      }
    } catch {
      setTelegramStatus('No se pudo invocar el servicio de alertas.');
    } finally {
      setEnviandoTelegram(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Botón de Tabs Mobile */}
      <div className="documentos-tabs-nav flex rounded-xl bg-slate-200/80 dark:bg-slate-900/90 p-1 border border-slate-300 dark:border-slate-800 shadow-xs">
        <button
          onClick={() => setTab('auto')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition-all whitespace-nowrap ${
            tab === 'auto'
              ? 'tab-auto-active bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs border border-blue-400/40'
              : 'tab-inactive text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Car className="h-3.5 w-3.5 shrink-0" />
          <span>Vehículo (SOAT / CITV)</span>
          {criticosAuto > 0 && (
            <span
              className={`h-2 w-2 rounded-full shrink-0 ${
                tab === 'auto' ? 'bg-amber-300 border border-blue-700' : 'bg-rose-500 animate-ping'
              }`}
            />
          )}
        </button>

        <button
          onClick={() => setTab('conductor')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition-all whitespace-nowrap ${
            tab === 'conductor'
              ? 'tab-conductor-active bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs border border-purple-400/40'
              : 'tab-inactive text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <User className="h-3.5 w-3.5 shrink-0" />
          <span>Conductor (Brevete)</span>
          {criticosConductor > 0 && (
            <span
              className={`h-2 w-2 rounded-full shrink-0 ${
                tab === 'conductor' ? 'bg-amber-300 border border-purple-700' : 'bg-rose-500 animate-ping'
              }`}
            />
          )}
        </button>
      </div>

      {/* Explicación de Semáforo de Reglas Peruanas en UNA SOLA LÍNEA SIN '...' */}
      <div className="documentos-reglas-leyenda flex items-center justify-between gap-1 rounded-xl bg-white dark:bg-slate-900/70 p-1 border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="flex-1 flex items-center justify-center gap-1 font-extrabold text-[9.5px] sm:text-[11px] py-1 px-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-500/10 text-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/20 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>Vigente (&gt;30d)</span>
        </span>
        <span className="flex-[1.25] flex items-center justify-center gap-1 font-extrabold text-[9.5px] sm:text-[11px] py-1 px-1 rounded-lg bg-amber-100/80 dark:bg-amber-500/10 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-500/20 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span>Por vencer (1-30d)</span>
        </span>
        <span className="flex-1 flex items-center justify-center gap-1 font-extrabold text-[9.5px] sm:text-[11px] py-1 px-1 rounded-lg bg-rose-100/80 dark:bg-rose-500/10 text-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-500/20 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
          <span>Vencido (≤0d)</span>
        </span>
      </div>

      {/* Lista de Documentos del Tab seleccionado */}
      <div className="space-y-3">
        {docsFiltrados.map((doc) => (
          <DocumentoCard
            key={doc.id}
            documento={doc}
            onRenovar={(d) => {
              setDocParaRenovar(d);
              setModalAbierto(true);
            }}
          />
        ))}
      </div>

      {/* Card de Notificaciones a Telegram */}
      <div className="rounded-2xl border-2 border-sky-300 dark:border-sky-500/20 bg-sky-50/80 dark:bg-sky-950/20 p-4 space-y-2 mt-6 shadow-sm">
        <div className="flex items-center gap-2 text-sky-900 dark:text-sky-400 text-xs font-black">
          <BellRing className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <span>Notificaciones Diarias a Telegram (Cron 13:00 UTC)</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          El bot despachará automáticamente alertas formateadas a las 8:00 AM hora de Lima si algún documento está por vencer o si el odómetro se acerca al servicio.
        </p>
        <button
          onClick={handleProbarTelegram}
          disabled={enviandoTelegram}
          className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-sky-400 dark:border-sky-500/40 bg-sky-100 hover:bg-sky-200 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 px-3.5 py-2 text-xs font-bold text-sky-900 dark:text-sky-300 active:scale-95 transition-all disabled:opacity-50"
        >
          {enviandoTelegram ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Evaluando y enviando...
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5" />
              Probar Envío a Telegram Ahora
            </>
          )}
        </button>

        {telegramStatus && (
          <p className="text-xs text-slate-900 dark:text-amber-300 mt-2 font-semibold bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 shadow-xs">
            {telegramStatus}
          </p>
        )}
      </div>

      {/* Modal de Renovación */}
      <ModalRenovacion
        documento={docParaRenovar}
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setDocParaRenovar(null);
        }}
      />
    </div>
  );
}
