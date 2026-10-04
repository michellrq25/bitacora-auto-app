import { CategoriaMantenimiento, TipoAceite, ViscosidadAceite } from '../types/mantenimiento.types';

export const DIAS_UMBRAL_SEMAFORO = {
  VERDE_MIN: 31,
  AMARILLO_MIN: 1,
  AMARILLO_MAX: 30,
  ROJO_MAX: 0,
} as const;

export const PROYECCION_ACEITE: Record<
  TipoAceite,
  { km: number; meses: number; etiqueta: string }
> = {
  sintetico: {
    km: 10000,
    meses: 12,
    etiqueta: '+10,000 km / 12 meses (Sintético)',
  },
  'semi-sintetico': {
    km: 5000,
    meses: 6,
    etiqueta: '+5,000 km / 6 meses (Semi-sintético)',
  },
  mineral: {
    km: 5000,
    meses: 6,
    etiqueta: '+5,000 km / 6 meses (Mineral)',
  },
};

export const UMBRAL_ALERTA_KM = 500; // Alerta si faltan <= 500 km para el próximo servicio

export const CATEGORIAS_MANTENIMIENTO: {
  id: CategoriaMantenimiento;
  label: string;
  icon: string;
}[] = [
  { id: 'aceite', label: 'Cambio de Aceite', icon: 'Droplets' },
  { id: 'frenos', label: 'Frenos y Discos', icon: 'ShieldAlert' },
  { id: 'neumaticos', label: 'Neumáticos / Rotación', icon: 'Disc' },
  { id: 'bateria', label: 'Batería y Eléctrico', icon: 'Zap' },
  { id: 'refrigeracion', label: 'Refrigeración / Radiador', icon: 'Thermometer' },
  { id: 'general', label: 'Inspección General', icon: 'Wrench' },
];

export const VISCOSIDADES_ACEITE: ViscosidadAceite[] = [
  '0W-16',
  '0W-20',
  '5W-20',
  '5W-30',
  '5W-40',
  '10W-30',
  '10W-40',
  '15W-40',
  '20W-50',
  'Otro',
];

export const MARCAS_LUBRICANTES = [
  'Motul',
  'Castrol',
  'Mobil 1',
  'Shell Helix',
  'Liqui Moly',
  'Valvoline',
  'TotalEnergies',
  'Repsol',
  'Havoline',
  'Gulf',
  'Pennzoil',
  'Ravenol',
  'Amsoil',
  'Petronas',
  'Idemitsu',
  'Toyota Genuine',
  'Nissan Genuine',
  'Kia Genuine / Mobis',
  'Eni (Agip)',
];
