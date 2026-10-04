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
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400 animate-pulse',
    },
    amarillo: {
      bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400 animate-pulse',
    },
    rojo: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-500 animate-ping',
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
