export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje_actual: number;
  color?: string;
  tipo_auto?: string;
  created_at?: string;
  updated_at?: string;
}

export type NuevoVehiculo = Omit<Vehiculo, 'id' | 'created_at' | 'updated_at'>;
export type ActualizarOdometroPayload = {
  vehiculo_id: string;
  nuevo_kilometraje: number;
};
