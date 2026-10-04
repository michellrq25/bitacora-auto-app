'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Droplets,
  Calendar,
  Gauge,
  Store,
  FileText,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';
import {
  CATEGORIAS_MANTENIMIENTO,
  VISCOSIDADES_ACEITE,
  MARCAS_LUBRICANTES,
  DEFAULT_VEHICULO,
} from '@/shared/constants';
import {
  CategoriaMantenimiento,
  TipoAceite,
  TipoMantenimiento,
  ViscosidadAceite,
} from '@/shared/types/mantenimiento.types';
import { calcularProximoServicioAceite } from '@/backend/services/alerta.service';
import { registrarMantenimientoAction } from '@/backend/actions/mantenimiento.actions';

export default function NuevoMantenimientoPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // ID de vehículo principal desde constantes centralizadas
  const [vehiculoId] = useState(DEFAULT_VEHICULO.id);

  // Estado del formulario
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [kilometraje, setKilometraje] = useState<number>(DEFAULT_VEHICULO.kilometraje_actual);
  const [tipo, setTipo] = useState<TipoMantenimiento>('preventivo');
  const [categoria, setCategoria] = useState<CategoriaMantenimiento>('aceite');
  const [costo, setCosto] = useState<number | string>(180);
  const [taller, setTaller] = useState('');
  const [notas, setNotas] = useState('');

  // Campos específicos de Aceite
  const [aceiteMarca, setAceiteMarca] = useState('Motul');
  const [aceiteModelo, setAceiteModelo] = useState('8100 X-cess Gen2');
  const [aceiteViscosidad, setAceiteViscosidad] = useState<ViscosidadAceite>('5W-30');
  const [aceiteTipo, setAceiteTipo] = useState<TipoAceite>('sintetico');

  // Próximo servicio (auto-calculado o editable)
  const [proximoKm, setProximoKm] = useState<number | ''>(58250);
  const [proximaFecha, setProximaFecha] = useState('');
  const [reglaTexto, setReglaTexto] = useState('');

  // Efecto: Cuando la categoría es 'aceite' y cambia el tipo o kilometraje, recalcular sugerencia automática
  useEffect(() => {
    if (categoria === 'aceite' && kilometraje > 0 && aceiteTipo) {
      const calculo = calcularProximoServicioAceite(kilometraje, aceiteTipo, fecha);
      setProximoKm(calculo.proximo_km);
      setProximaFecha(calculo.proxima_fecha);
      setReglaTexto(calculo.reglaAplicada);
    }
  }, [categoria, kilometraje, aceiteTipo, fecha]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const payload = {
        vehiculo_id: vehiculoId,
        fecha,
        kilometraje: Number(kilometraje),
        tipo,
        categoria,
        costo: Number(costo) || 0,
        taller: taller.trim() || null,
        notas: notas.trim() || null,
        proximo_servicio_km: proximoKm === '' ? null : Number(proximoKm),
        proximo_servicio_fecha: proximaFecha || null,
        ...(categoria === 'aceite'
          ? {
              aceite_marca: aceiteMarca,
              aceite_modelo: aceiteModelo,
              aceite_viscosidad: aceiteViscosidad,
              aceite_tipo: aceiteTipo,
            }
          : {}),
      };

      const result = await registrarMantenimientoAction(payload);

      if (result.success) {
        router.push('/mantenimientos');
        router.refresh();
      } else {
        setError(result.error || 'Ocurrió un error al guardar el mantenimiento');
      }
    });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-4 pb-28">
      {/* Barra de Navegación Superior */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/mantenimientos"
          className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Registrar Mantenimiento</h1>
          <p className="text-xs text-slate-400">Control de bitácora y lubricantes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Categoría Selector (Chips Móviles) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Categoría del Servicio
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIAS_MANTENIMIENTO.map((cat) => {
              const isSelected = categoria === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoria(cat.id)}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold text-left transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500/15 text-white ring-1 ring-sky-500'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={isSelected ? 'text-sky-400' : 'text-slate-400'}>
                    •
                  </span>
                  <span className="line-clamp-1">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tipo de Mantenimiento (Preventivo vs Correctivo) */}
        <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setTipo('preventivo')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              tipo === 'preventivo'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Preventivo
          </button>
          <button
            type="button"
            onClick={() => setTipo('correctivo')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              tipo === 'correctivo'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Correctivo
          </button>
        </div>

        {/* Kilometraje y Fecha */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Kilometraje
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                required
                value={kilometraje}
                onChange={(e) => setKilometraje(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 pl-9 text-sm font-semibold text-white focus:border-sky-500 focus:outline-none"
              />
              <Gauge className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Fecha
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
              />
              <Calendar className="hidden sm:block absolute right-2.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* SECCIÓN CONDICIONAL: DETALLE TÉCNICO DE ACEITE */}
        {categoria === 'aceite' && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm border-b border-amber-500/20 pb-2">
              <Droplets className="h-4 w-4" />
              <span>Detalle Técnico de Lubricante</span>
            </div>

            {/* Tipo de Aceite (Sintético / Semi / Mineral) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Tipo de Aceite de Motor
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['sintetico', 'semi-sintetico', 'mineral'] as TipoAceite[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAceiteTipo(t)}
                    className={`rounded-xl border py-2 text-center text-xs font-medium capitalize transition-all ${
                      aceiteTipo === t
                        ? 'border-amber-400 bg-amber-500/25 text-amber-200 ring-1 ring-amber-400'
                        : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Viscosidad y Marca */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Viscosidad SAE
                </label>
                <select
                  value={aceiteViscosidad}
                  onChange={(e) => setAceiteViscosidad(e.target.value as ViscosidadAceite)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-amber-300 focus:border-amber-400 focus:outline-none"
                >
                  {VISCOSIDADES_ACEITE.map((visc) => (
                    <option key={visc} value={visc}>
                      {visc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Marca de Lubricante
                </label>
                <select
                  value={MARCAS_LUBRICANTES.includes(aceiteMarca) ? aceiteMarca : 'Otra'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Otra') {
                      setAceiteMarca('');
                    } else {
                      setAceiteMarca(val);
                    }
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-amber-300 focus:border-amber-400 focus:outline-none"
                >
                  {MARCAS_LUBRICANTES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="Otra">Otra marca (personalizada)...</option>
                </select>
              </div>
            </div>

            {/* Si seleccionó 'Otra marca', mostrar campo de texto para escribirla */}
            {(!MARCAS_LUBRICANTES.includes(aceiteMarca) || aceiteMarca === '') && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Escribir Nombre de Marca Personalizada
                </label>
                <input
                  type="text"
                  required
                  value={aceiteMarca}
                  onChange={(e) => setAceiteMarca(e.target.value)}
                  placeholder="Ej. Ravenol, Amsoil, Petronas, etc."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Línea / Modelo de Aceite
              </label>
              <input
                type="text"
                value={aceiteModelo}
                onChange={(e) => setAceiteModelo(e.target.value)}
                placeholder="Ej. 8100 X-cess Gen2 / Helix Ultra"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Banner de Proyección Automática */}
            <div className="flex items-start gap-2 rounded-xl bg-amber-950/30 border border-amber-500/20 p-2.5 text-xs text-amber-200">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-semibold">Sugerencia inteligente: </span>
                {reglaTexto}
              </div>
            </div>
          </div>
        )}

        {/* Próximo Servicio Proyectado */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Programación de Próximo Servicio
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Próximo en Km</label>
              <input
                type="number"
                min="0"
                value={proximoKm}
                onChange={(e) =>
                  setProximoKm(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="Ej. 55000"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono font-semibold text-sky-400 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Fecha sugerida</label>
              <input
                type="date"
                value={proximaFecha}
                onChange={(e) => setProximaFecha(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Costo, Taller y Notas */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Costo Total (Soles)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 pl-9 text-base font-bold text-white focus:border-sky-500 focus:outline-none"
              />
              <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">
                S/
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Taller / Lubricentro (Opcional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={taller}
                onChange={(e) => setTaller(e.target.value)}
                placeholder="Ej. Lubricentro Express Surquillo"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 pl-9 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
              <Store className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notas Adicionales (Opcional)
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej. Se cambió filtro de aire y arandela de cárter..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Check className="h-5 w-5" />
              Guardar en Bitácora
            </>
          )}
        </button>
      </form>
    </div>
  );
}
