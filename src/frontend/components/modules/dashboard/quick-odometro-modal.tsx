'use client';

import React, { useState, useTransition } from 'react';
import { BottomSheetModal } from '@/frontend/components/ui/bottom-sheet-modal';
import { Gauge, Check, Loader2 } from 'lucide-react';
import { actualizarOdometroAction } from '@/backend/actions/odometro.actions';

interface QuickOdometroModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehiculoId: string;
  kilometrajeActual: number;
}

export function QuickOdometroModal({
  isOpen,
  onClose,
  vehiculoId,
  kilometrajeActual,
}: QuickOdometroModalProps) {
  const [km, setKm] = useState(kilometrajeActual);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await actualizarOdometroAction({
        vehiculo_id: vehiculoId,
        nuevo_kilometraje: Number(km),
      });

      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'No se pudo actualizar el kilometraje');
      }
    });
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Actualizar Odómetro"
    >
      <form onSubmit={handleGuardar} className="space-y-4">
        <p className="text-sm text-slate-400">
          Ingresa la lectura actual que figura en el tablero del auto:
        </p>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">
            Kilometraje Actual (km)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="1500000"
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pl-11 text-xl font-bold text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <Gauge className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
            <span className="absolute right-4 top-3.5 text-sm font-medium text-slate-400">
              km
            </span>
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
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4" />
                Guardar
              </>
            )}
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}
