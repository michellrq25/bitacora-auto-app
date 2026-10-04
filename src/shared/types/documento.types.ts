export type TipoDocumento =
  | 'SOAT'
  | 'RevisionTecnica'
  | 'LicenciaConducir'
  | 'Otro';

export type ResponsableDocumento = 'auto' | 'conductor';

export type EstadoSemaforo = 'verde' | 'amarillo' | 'rojo';

export interface Documento {
  id: string;
  vehiculo_id?: string | null;
  tipo_documento: TipoDocumento;
  nombre_identificador: string;
  numero_documento?: string | null;
  entidad_emisora?: string | null;
  fecha_emision: string;
  fecha_vencimiento: string;
  responsable: ResponsableDocumento;
  created_at?: string;
  updated_at?: string;
}

export type NuevoDocumento = Omit<Documento, 'id' | 'created_at' | 'updated_at'>;

export interface DocumentoConEstado extends Documento {
  dias_restantes: number;
  estado_semaforo: EstadoSemaforo;
  estado_etiqueta: string;
}

export type ActualizarVencimientoPayload = {
  documento_id: string;
  nueva_fecha_emision: string;
  nueva_fecha_vencimiento: string;
  nuevo_numero_documento?: string | null;
};
