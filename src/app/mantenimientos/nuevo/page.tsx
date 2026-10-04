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
          className="rounded-xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-400 hover:text-blue-600 transition-colors shadow-xs"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Registrar Mantenimiento</h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Control de bitácora y lubricantes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Categoría Selector (Chips Móviles) */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
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
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all min-h-[50px] ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <span className={`text-lg leading-none shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    •
                  </span>
                  <span className="text-[13px] font-bold leading-tight whitespace-normal">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tipo de Mantenimiento (Preventivo vs Correctivo) */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900/90 p-1 border-2 border-slate-300 dark:border-slate-800 shadow-xs">
          <button
            type="button"
            onClick={() => setTipo('preventivo')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-black transition-all ${
              tipo === 'preventivo'
                ? 'bg-emerald-600 text-white shadow-md border border-emerald-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Preventivo
          </button>
          <button
            type="button"
            onClick={() => setTipo('correctivo')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-black transition-all ${
              tipo === 'correctivo'
                ? 'bg-rose-600 text-white shadow-md border border-rose-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Correctivo
          </button>
        </div>

        {/* Kilometraje y Fecha */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Kilometraje
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                required
                value={kilometraje}
                onChange={(e) => setKilometraje(Number(e.target.value))}
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 pl-9 text-sm font-black text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none shadow-xs"
              />
              <Gauge className="absolute left-2.5 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Fecha
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none shadow-xs"
              />
              <Calendar className="hidden sm:block absolute right-2.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* SECCIÓN CONDICIONAL: DETALLE TÉCNICO DE ACEITE */}
        {categoria === 'aceite' && (
          <div className="rounded-2xl border-2 border-amber-400/80 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/5 p-4 space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 text-amber-950 dark:text-amber-400 font-black text-sm border-b-2 border-amber-200 dark:border-amber-500/20 pb-2">
              <Droplets className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Detalle Técnico de Lubricante</span>
            </div>

            {/* Tipo de Aceite (Sintético / Semi / Mineral) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tipo de Aceite de Motor
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['sintetico', 'semi-sintetico', 'mineral'] as TipoAceite[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAceiteTipo(t)}
                    className={`rounded-xl border-2 py-2.5 text-center text-xs font-black capitalize transition-all ${
                      aceiteTipo === t
                        ? 'border-amber-600 bg-amber-600 text-white shadow-md shadow-amber-500/25'
                        : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-amber-400'
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Viscosidad SAE
                </label>
                <select
                  value={aceiteViscosidad}
                  onChange={(e) => setAceiteViscosidad(e.target.value as ViscosidadAceite)}
                  className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono font-black text-slate-900 dark:text-amber-300 focus:border-amber-500 focus:outline-none shadow-xs"
                >
                  {VISCOSIDADES_ACEITE.map((visc) => (
                    <option key={visc} value={visc}>
                      {visc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
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
                  className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-bold text-slate-900 dark:text-amber-300 focus:border-amber-500 focus:outline-none shadow-xs"
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Escribir Nombre de Marca Personalizada
                </label>
                <input
                  type="text"
                  required
                  value={aceiteMarca}
                  onChange={(e) => setAceiteMarca(e.target.value)}
                  placeholder="Ej. Ravenol, Amsoil, Petronas, etc."
                  className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none shadow-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Línea / Modelo de Aceite
              </label>
              <input
                type="text"
                value={aceiteModelo}
                onChange={(e) => setAceiteModelo(e.target.value)}
                placeholder="Ej. 8100 X-cess Gen2 / Helix Ultra"
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none shadow-xs"
              />
            </div>

            {/* Banner de Proyección Automática */}
            <div className="flex items-start gap-2.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-500/40 p-3 text-xs shadow-xs">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
              <div>
                <span className="font-black text-amber-950 dark:text-amber-200">Sugerencia inteligente: </span>
                <span className="font-bold text-amber-900 dark:text-amber-100">{reglaTexto}</span>
              </div>
            </div>
          </div>
        )}

        {/* Próximo Servicio Proyectado */}
        <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 space-y-3 shadow-xs">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-400">
            Programación de Próximo Servicio
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Próximo en Km</label>
              <input
                type="number"
                min="0"
                value={proximoKm}
                onChange={(e) =>
                  setProximoKm(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="Ej. 55000"
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono font-black text-blue-700 dark:text-sky-400 focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fecha sugerida</label>
              <input
                type="date"
                value={proximaFecha}
                onChange={(e) => setProximaFecha(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Costo, Taller y Notas */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
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
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 pl-10 text-base font-black text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none shadow-xs"
              />
              <span className="absolute left-3.5 top-2.5 text-sm font-black text-blue-600 dark:text-slate-400">
                S/
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Taller / Lubricentro (Opcional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={taller}
                onChange={(e) => setTaller(e.target.value)}
                placeholder="Ej. Lubricentro Express Surquillo"
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 pl-9 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:outline-none shadow-xs"
              />
              <Store className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notas Adicionales (Opcional)
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej. Se cambió filtro de aire y arandela de cárter..."
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:outline-none resize-none shadow-xs"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-3 text-xs font-bold text-rose-900 shadow-xs">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Check className="h-5 w-5 stroke-[2.5]" />
              Guardar en Bitácora
            </>
          )}
        </button>
      </form>
    </div>
  );
}
