import {
  Documento,
  DocumentoConEstado,
  EstadoSemaforo,
} from '@/shared/types/documento.types';
import { TipoAceite } from '@/shared/types/mantenimiento.types';
import { PROYECCION_ACEITE, UMBRAL_ALERTA_KM } from '@/shared/constants/reglas';

/**
 * Calcula la diferencia en días naturales entre hoy y la fecha objetivo.
 * Días positivos: faltan días para vencer.
 * Días negativos: ya venció.
 */
export function calcularDiasRestantes(fechaVencimiento: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Parsear fecha ISO (YYYY-MM-DD)
  const partes = fechaVencimiento.split('-');
  if (partes.length !== 3) return 0;

  const fechaVenc = new Date(
    parseInt(partes[0], 10),
    parseInt(partes[1], 10) - 1,
    parseInt(partes[2], 10)
  );
  fechaVenc.setHours(0, 0, 0, 0);

  const diferenciaMs = fechaVenc.getTime() - hoy.getTime();
  return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
}

/**
 * Determina el semáforo normativo peruano:
 * - Verde (> 30 días restantes): Vigente
 * - Amarillo (1 a 30 días restantes): Por vencer
 * - Rojo (<= 0 días): Vencido
 */
export function obtenerEstadoSemaforo(diasRestantes: number): {
  estado: EstadoSemaforo;
  etiqueta: string;
} {
  if (diasRestantes > 30) {
    return {
      estado: 'verde',
      etiqueta: `Vigente (${diasRestantes} días)`,
    };
  }

  if (diasRestantes >= 1) {
    return {
      estado: 'amarillo',
      etiqueta: `Por vencer (${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'})`,
    };
  }

  if (diasRestantes === 0) {
    return {
      estado: 'rojo',
      etiqueta: 'Vence HOY',
    };
  }

  return {
    estado: 'rojo',
    etiqueta: `Vencido hace ${Math.abs(diasRestantes)} días`,
  };
}

/**
 * Enriquecer un documento con sus cálculos de vencimiento y semáforo.
 */
export function enriquecerDocumento(doc: Documento): DocumentoConEstado {
  const diasRestantes = calcularDiasRestantes(doc.fecha_vencimiento);
  const { estado, etiqueta } = obtenerEstadoSemaforo(diasRestantes);

  return {
    ...doc,
    dias_restantes: diasRestantes,
    estado_semaforo: estado,
    estado_etiqueta: etiqueta,
  };
}

/**
 * Evalúa si el odómetro actual está a menos de 500 km del próximo servicio.
 */
export function evaluarAlertaKilometraje(
  kmActual: number,
  proximoKm: number | null | undefined
): {
  tieneAlerta: boolean;
  kmFaltantes: number;
  mensaje: string;
  esExcedido: boolean;
} {
  if (!proximoKm) {
    return {
      tieneAlerta: false,
      kmFaltantes: 0,
      mensaje: 'Sin próximo servicio programado por km',
      esExcedido: false,
    };
  }

  const kmFaltantes = proximoKm - kmActual;

  if (kmFaltantes < 0) {
    return {
      tieneAlerta: true,
      kmFaltantes,
      mensaje: `¡Servicio excedido por ${Math.abs(kmFaltantes).toLocaleString('es-PE')} km!`,
      esExcedido: true,
    };
  }

  if (kmFaltantes <= UMBRAL_ALERTA_KM) {
    return {
      tieneAlerta: true,
      kmFaltantes,
      mensaje: `Próximo servicio muy cercano: faltan ${kmFaltantes.toLocaleString('es-PE')} km`,
      esExcedido: false,
    };
  }

  return {
    tieneAlerta: false,
    kmFaltantes,
    mensaje: `Faltan ${kmFaltantes.toLocaleString('es-PE')} km para el próximo servicio`,
    esExcedido: false,
  };
}

/**
 * Sugiere el próximo servicio técnico según el tipo de lubricante:
 * - Sintético: +10,000 km o 12 meses
 * - Semi-sintético o Mineral: +5,000 km o 6 meses
 */
export function calcularProximoServicioAceite(
  kmActual: number,
  tipoAceite: TipoAceite,
  fechaBase: string = new Date().toISOString().split('T')[0]
): {
  proximo_km: number;
  proxima_fecha: string;
  reglaAplicada: string;
} {
  const regla = PROYECCION_ACEITE[tipoAceite];
  const proximo_km = kmActual + regla.km;

  const partes = fechaBase.split('-');
  const base = new Date(
    parseInt(partes[0], 10),
    parseInt(partes[1], 10) - 1,
    parseInt(partes[2], 10)
  );
  base.setMonth(base.getMonth() + regla.meses);

  const yyyy = base.getFullYear();
  const mm = String(base.getMonth() + 1).padStart(2, '0');
  const dd = String(base.getDate()).padStart(2, '0');
  const proxima_fecha = `${yyyy}-${mm}-${dd}`;

  return {
    proximo_km,
    proxima_fecha,
    reglaAplicada: regla.etiqueta,
  };
}
