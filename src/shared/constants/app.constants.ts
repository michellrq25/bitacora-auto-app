/**
 * Constantes generales del sistema y configuraciones regionales (Perú)
 */

export const MONEDA_CONFIG = {
  codigo: 'PEN',
  simbolo: 'S/',
  nombre: 'Soles Peruanos',
  separadorMiles: ',',
  separadorDecimales: '.',
} as const;

export const LOCALE_PERU = 'es-PE';

/**
 * Formatea un monto numérico a formato monetario en Soles (ej: 185 -> "S/ 185.00")
 */
export function formatearMoneda(monto: number | null | undefined): string {
  const valor = Number(monto || 0);
  return `${MONEDA_CONFIG.simbolo} ${valor.toLocaleString(LOCALE_PERU, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Formatea un kilometraje numérico (ej: 48250 -> "48,250 km")
 */
export function formatearKilometraje(km: number | null | undefined): string {
  const valor = Math.round(Number(km || 0));
  return `${valor.toLocaleString(LOCALE_PERU)} km`;
}

/**
 * Formatea una fecha ISO a formato local de Perú (ej: "2024-10-26" -> "26 oct 2024")
 */
export function formatearFechaCorta(fechaStr: string | null | undefined): string {
  if (!fechaStr) return '-';
  try {
    const [year, month, day] = fechaStr.split('-').map(Number);
    if (!year || !month || !day) return fechaStr;
    const fecha = new Date(year, month - 1, day);
    return fecha.toLocaleDateString(LOCALE_PERU, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return fechaStr;
  }
}
