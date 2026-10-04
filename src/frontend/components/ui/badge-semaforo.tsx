import React from 'react';
import { EstadoSemaforo } from '@/shared/types/documento.types';

interface BadgeSemaforoProps {
  estado: EstadoSemaforo;
  texto: string;
  size?: 'sm' | 'md';
}

export function BadgeSemaforo({ estado, texto, size = 'md' }: BadgeSemaforoProps) {
  const configs = {
    verde: {
      bg: 'badge-semaforo-verde bg-emerald-100 dark:bg-emerald-500/15 text-emerald-950 dark:text-emerald-300 border-2 border-emerald-400 dark:border-emerald-500/30 font-bold shadow-xs',
      dot: 'bg-emerald-600 dark:bg-emerald-400 animate-pulse',
    },
    amarillo: {
      bg: 'badge-semaforo-amarillo bg-amber-100 dark:bg-amber-500/15 text-amber-950 dark:text-amber-300 border-2 border-amber-400 dark:border-amber-500/30 font-bold shadow-xs',
      dot: 'bg-amber-600 dark:bg-amber-400 animate-pulse',
    },
    rojo: {
      bg: 'badge-semaforo-rojo bg-rose-100 dark:bg-rose-500/15 text-rose-950 dark:text-rose-300 border-2 border-rose-400 dark:border-rose-500/30 font-bold shadow-xs',
      dot: 'bg-rose-600 dark:bg-rose-500 animate-ping',
    },
  };

  const { bg, dot } = configs[estado] || configs.verde;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${bg} ${padding} transition-colors`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span>{texto}</span>
    </span>
  );
}
