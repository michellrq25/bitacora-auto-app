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
      <div className="flex rounded-2xl bg-slate-900/90 p-1.5 border border-slate-800">
        <button
          onClick={() => setTab('auto')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
            tab === 'auto'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Car className="h-4 w-4" />
          <span>Vehículo (SOAT / CITV)</span>
          {criticosAuto > 0 && (
            <span
              className={`h-2 w-2 rounded-full ${
                tab === 'auto' ? 'bg-rose-900' : 'bg-rose-500 animate-ping'
              }`}
            />
          )}
        </button>

        <button
          onClick={() => setTab('conductor')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
            tab === 'conductor'
              ? 'bg-purple-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Conductor (Brevete)</span>
          {criticosConductor > 0 && (
            <span
              className={`h-2 w-2 rounded-full ${
                tab === 'conductor' ? 'bg-rose-900' : 'bg-rose-500 animate-ping'
              }`}
            />
          )}
        </button>
      </div>

      {/* Explicación de Semáforo de Reglas Peruanas */}
      <div className="flex items-center justify-around rounded-xl bg-slate-900/40 p-2 text-[11px] text-slate-400 border border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Vigente (&gt;30d)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Por vencer (1-30d)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Vencido (≤0d)
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
      <div className="rounded-2xl border border-sky-500/20 bg-sky-950/20 p-4 space-y-2 mt-6">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
          <BellRing className="h-4 w-4" />
          <span>Notificaciones Diarias a Telegram (Cron 13:00 UTC)</span>
        </div>
        <p className="text-xs text-slate-400">
          El bot despachará automáticamente alertas formateadas a las 8:00 AM hora de Lima si algún documento está por vencer o si el odómetro se acerca al servicio.
        </p>
        <button
          onClick={handleProbarTelegram}
          disabled={enviandoTelegram}
          className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 active:scale-95 transition-all disabled:opacity-50"
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
          <p className="text-xs text-amber-300 mt-2 font-medium bg-slate-900/80 p-2 rounded-lg border border-slate-800">
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
