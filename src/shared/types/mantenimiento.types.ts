export type TipoMantenimiento = 'preventivo' | 'correctivo';

export type CategoriaMantenimiento =
  | 'aceite'
  | 'frenos'
  | 'neumaticos'
  | 'bateria'
  | 'refrigeracion'
  | 'general';

export type TipoAceite = 'sintetico' | 'semi-sintetico' | 'mineral';

export type ViscosidadAceite =
  | '0W-16'
  | '0W-20'
  | '5W-20'
  | '5W-30'
  | '5W-40'
  | '10W-30'
  | '10W-40'
  | '15W-40'
  | '20W-50'
  | 'Otro';

export interface Mantenimiento {
  id: string;
  vehiculo_id: string;
  fecha: string;
  kilometraje: number;
  tipo: TipoMantenimiento;
  categoria: CategoriaMantenimiento;
  costo: number;
  taller?: string | null;
  notas?: string | null;
  proximo_servicio_km?: number | null;
  proximo_servicio_fecha?: string | null;

  // Detalle técnico de lubricantes
  aceite_marca?: string | null;
  aceite_modelo?: string | null;
  aceite_viscosidad?: string | null;
  aceite_tipo?: TipoAceite | null;

  created_at?: string;
}

export type NuevoMantenimiento = Omit<Mantenimiento, 'id' | 'created_at'>;

export interface ResumenGastoCategoria {
  categoria: CategoriaMantenimiento;
  total: number;
  cantidad: number;
}
