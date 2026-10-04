import { Vehiculo } from '../types/vehiculo.types';

/**
 * Constantes y configuración principal del vehículo
 * (Única fuente de verdad para la configuración por código)
 */
export const DEFAULT_VEHICULO_PLACA = 'BDL-281';

export const DEFAULT_VEHICULO_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

export const DEFAULT_VEHICULO: Vehiculo = {
  id: DEFAULT_VEHICULO_ID,
  placa: DEFAULT_VEHICULO_PLACA,
  marca: 'Kia',
  modelo: 'Sportage',
  anio: 2018,
  kilometraje_actual: 84550,
  color: 'Plata mineral',
  tipo_auto: 'SUV'
};

/**
 * Expresión regular para validación de placas vehiculares en Perú (MTC)
 * Formato estándar: 3 alfanuméricos + guion opcional + 3 alfanuméricos/números
 * Ejemplos: ABC-123, A1B-123, B7C-890
 */
export const REGEX_PLACA_PERU = /^[A-Z0-9]{3}-?[A-Z0-9]{3}$/i;

/**
 * Limpia y normaliza una placa vehicular al formato oficial con guion (ej. 'abc123' -> 'ABC-123')
 */
export function normalizarPlaca(placa: string): string {
  if (!placa) return '';
  const limpia = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (limpia.length <= 3) return limpia;
  return `${limpia.substring(0, 3)}-${limpia.substring(3, 6)}`;
}

/**
 * Verifica si una placa cumple con el estándar vehicular de Perú
 */
export function esPlacaValida(placa: string): boolean {
  if (!placa) return false;
  return REGEX_PLACA_PERU.test(placa.trim());
}

/**
 * Marcas vehiculares más comunes y comerciales en el parque automotor peruano
 */
export const MARCAS_VEHICULOS_PERU = [
  'Toyota',
  'Hyundai',
  'Kia',
  'Nissan',
  'Chevrolet',
  'Suzuki',
  'Volkswagen',
  'Mazda',
  'Honda',
  'Mitsubishi',
  'Ford',
  'Renault',
  'Changan',
  'Chery',
  'DFSK',
  'Geely',
  'JAC',
  'Subaru',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Peugeot',
] as const;

/**
 * Tipos de combustible utilizados en Perú
 */
export const TIPOS_COMBUSTIBLE_PERU = [
  { id: 'gasolina-regular', label: 'Gasolina Regular (90 oct)' },
  { id: 'gasolina-premium', label: 'Gasolina Premium (95/97 oct)' },
  { id: 'glp', label: 'GLP (Gas Licuado de Petróleo)' },
  { id: 'gnv', label: 'GNV (Gas Natural Vehicular)' },
  { id: 'diesel', label: 'Diésel / Petróleo (B5)' },
  { id: 'hibrido', label: 'Híbrido (HEV / PHEV)' },
  { id: 'electrico', label: '100% Eléctrico (EV)' },
] as const;
