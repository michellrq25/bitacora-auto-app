'use client';

import React, { useState } from 'react';
import { Mantenimiento } from '@/shared/types/mantenimiento.types';
import { MantenimientoCard } from '@/frontend/components/modules/mantenimientos/mantenimiento-card';
import { CATEGORIAS_MANTENIMIENTO } from '@/shared/constants/reglas';
import { Filter } from 'lucide-react';

interface MantenimientosClientViewProps {
  itemsIniciales: Mantenimiento[];
}

export function MantenimientosClientView({ itemsIniciales }: MantenimientosClientViewProps) {
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');

  const itemsFiltrados = itemsIniciales.filter((m) => {
    if (categoriaFiltro === 'todas') return true;
    return m.categoria === categoriaFiltro;
  });

  return (
    <div className="space-y-4">
      {/* Filtro horizontal deslizable */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setCategoriaFiltro('todas')}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
            categoriaFiltro === 'todas'
              ? 'bg-sky-500 text-slate-950 font-bold shadow'
              : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Todas
        </button>

        {CATEGORIAS_MANTENIMIENTO.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaFiltro(cat.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              categoriaFiltro === cat.id
                ? 'bg-sky-500 text-slate-950 font-bold shadow'
                : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lista de Registros */}
      {itemsFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 text-center">
          <Filter className="mx-auto h-8 w-8 text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-300">
            No hay registros para la categoría seleccionada.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Puedes registrar un nuevo servicio presionando el botón "Nuevo".
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {itemsFiltrados.map((item) => (
            <MantenimientoCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
