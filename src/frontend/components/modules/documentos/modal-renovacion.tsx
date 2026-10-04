'use client';

import React, { useState, useTransition } from 'react';
import { BottomSheetModal } from '@/frontend/components/ui/bottom-sheet-modal';
import { DocumentoConEstado } from '@/shared/types/documento.types';
import {
  DOCUMENTOS_NORMATIVOS_PERU,
  CATEGORIAS_BREVETE_MTC,
  ASEGURADORAS_SOAT_PERU,
  PLANTAS_CITV_PERU,
} from '@/shared/constants';
import { renovarDocumentoAction } from '@/backend/actions/documento.actions';
import { Calendar, FileCheck, Check, Loader2, Award, Building2 } from 'lucide-react';

interface ModalRenovacionProps {
  documento: DocumentoConEstado | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ModalRenovacion({
  documento,
  isOpen,
  onClose,
}: ModalRenovacionProps) {
  const [emision, setEmision] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [numero, setNumero] = useState('');
  const [nombreIdentificador, setNombreIdentificador] = useState('');
  const [entidadEmisora, setEntidadEmisora] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset values when document changes
  React.useEffect(() => {
    if (documento) {
      setEmision(new Date().toISOString().split('T')[0]);
      setNombreIdentificador(documento.nombre_identificador || '');
      setEntidadEmisora(documento.entidad_emisora || '');
      
      // Auto-sugerir vencimiento según normativa oficial de Perú
      const vigenciaMeses =
        DOCUMENTOS_NORMATIVOS_PERU[documento.tipo_documento]?.vigenciaDefectoMeses || 12;
      const fechaVenc = new Date();
      fechaVenc.setMonth(fechaVenc.getMonth() + vigenciaMeses);
      setVencimiento(fechaVenc.toISOString().split('T')[0]);
      setNumero(documento.numero_documento || '');
      setError(null);
    }
  }, [documento]);

  if (!documento) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await renovarDocumentoAction({
        documento_id: documento.id,
        nueva_fecha_emision: emision,
        nueva_fecha_vencimiento: vencimiento,
        nuevo_numero_documento: numero,
        nuevo_nombre_identificador: nombreIdentificador,
        nueva_entidad_emisora: entidadEmisora,
      });

      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Ocurrió un error al guardar la renovación');
      }
    });
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Renovar: ${documento.nombre_identificador}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Si es Licencia de Conducir, permitir elegir la Categoría MTC */}
        {documento.tipo_documento === 'LicenciaConducir' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Categoría de Brevete (MTC)
            </label>
            <div className="relative mt-1">
              <select
                value={nombreIdentificador}
                onChange={(e) => setNombreIdentificador(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 pl-10 text-xs text-white focus:border-sky-500 focus:outline-none appearance-none"
              >
                {CATEGORIAS_BREVETE_MTC.map((cat) => (
                  <option
                    key={cat.categoria}
                    value={`Licencia Clase A Categoría ${cat.categoria}`}
                  >
                    Clase A Categoría {cat.categoria} ({cat.descripcion})
                  </option>
                ))}
              </select>
              <Award className="absolute left-3 top-3 h-4 w-4 text-sky-400" />
            </div>
          </div>
        )}

        {/* Entidad Emisora / Aseguradora */}
        <div>
          <label className="block text-xs font-semibold text-slate-300">
            {documento.tipo_documento === 'SOAT'
              ? 'Aseguradora (Compañía de Seguros)'
              : documento.tipo_documento === 'RevisionTecnica'
              ? 'Planta Autorizada (CITV)'
              : 'Entidad Emisora'}
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              list="entidades-sugeridas-list"
              value={entidadEmisora}
              onChange={(e) => setEntidadEmisora(e.target.value)}
              placeholder={
                documento.tipo_documento === 'SOAT'
                  ? 'Ej. Rímac Seguros, Pacífico, La Positiva...'
                  : 'Ej. Farenet, Lidercon...'
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <datalist id="entidades-sugeridas-list">
              {documento.tipo_documento === 'SOAT' &&
                ASEGURADORAS_SOAT_PERU.map((aseg) => (
                  <option key={aseg} value={aseg} />
                ))}
              {documento.tipo_documento === 'RevisionTecnica' &&
                PLANTAS_CITV_PERU.map((planta) => (
                  <option key={planta} value={planta} />
                ))}
            </datalist>
          </div>

          {/* Accesos rápidos táctiles para SOAT */}
          {documento.tipo_documento === 'SOAT' && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ASEGURADORAS_SOAT_PERU.map((aseg) => (
                <button
                  key={aseg}
                  type="button"
                  onClick={() => setEntidadEmisora(aseg)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                    entidadEmisora.toLowerCase() === aseg.toLowerCase()
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {aseg}
                </button>
              ))}
            </div>
          )}

          {/* Accesos rápidos táctiles para Inspección Técnica (CITV) */}
          {documento.tipo_documento === 'RevisionTecnica' && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PLANTAS_CITV_PERU.map((planta) => (
                <button
                  key={planta}
                  type="button"
                  onClick={() => setEntidadEmisora(planta)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                    entidadEmisora.toLowerCase() === planta.toLowerCase()
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {planta}
                </button>
              ))}
            </div>
          )}

          {/* Accesos rápidos táctiles para Licencia de Conducir */}
          {documento.tipo_documento === 'LicenciaConducir' && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {DOCUMENTOS_NORMATIVOS_PERU.LicenciaConducir.entidadesSugeridas.map(
                (entidad) => (
                  <button
                    key={entidad}
                    type="button"
                    onClick={() => setEntidadEmisora(entidad)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                      entidadEmisora.toLowerCase() === entidad.toLowerCase()
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {entidad}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300">
            Número de Póliza / Certificado / Licencia
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Ej. POL-2024-991823"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
            <FileCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Fecha de Emisión
            </label>
            <div className="relative mt-1">
              <input
                type="date"
                required
                value={emision}
                onChange={(e) => setEmision(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
              />
              <Calendar className="hidden sm:block absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Nueva Fecha Vencimiento
            </label>
            <div className="relative mt-1">
              <input
                type="date"
                required
                value={vencimiento}
                onChange={(e) => setVencimiento(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
              />
              <Calendar className="hidden sm:block absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4" />
                Actualizar Vencimiento
              </>
            )}
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}
