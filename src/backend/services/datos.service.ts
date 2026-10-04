import { createClient } from '@/backend/db/server';
import { Vehiculo } from '@/shared/types/vehiculo.types';
import { Documento, DocumentoConEstado } from '@/shared/types/documento.types';
import { Mantenimiento } from '@/shared/types/mantenimiento.types';
import { DEFAULT_VEHICULO } from '@/shared/constants';
import { enriquecerDocumento, evaluarAlertaKilometraje } from './alerta.service';

// Mock de vehículo inicial por defecto desde constantes compartidas
const VEHICULO_DEFAULT: Vehiculo = DEFAULT_VEHICULO;

// Fechas dinámicas relativas para documentos de muestra
const hoy = new Date();
const formatFecha = (d: Date) => d.toISOString().split('T')[0];

const fechaSoatVenc = new Date(hoy);
fechaSoatVenc.setDate(hoy.getDate() + 22); // Amarillo: 22 días restantes

const fechaCitvVenc = new Date(hoy);
fechaCitvVenc.setMonth(hoy.getMonth() + 6); // Verde: 6 meses

const fechaBreveteVenc = new Date(hoy);
fechaBreveteVenc.setDate(hoy.getDate() - 4); // Rojo: vencido hace 4 días

const DOCUMENTOS_DEFAULT: Documento[] = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    vehiculo_id: VEHICULO_DEFAULT.id,
    tipo_documento: 'SOAT',
    nombre_identificador: 'SOAT Digital Pacífico / La Positiva',
    numero_documento: 'POL-98471203',
    entidad_emisora: 'La Positiva Seguros',
    fecha_emision: '2023-10-26',
    fecha_vencimiento: formatFecha(fechaSoatVenc),
    responsable: 'auto',
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    vehiculo_id: VEHICULO_DEFAULT.id,
    tipo_documento: 'RevisionTecnica',
    nombre_identificador: 'Revisión Técnica Vehicular (CITV)',
    numero_documento: 'CITV-2024-88419',
    entidad_emisora: 'Farenet Lima Norte',
    fecha_emision: '2024-04-10',
    fecha_vencimiento: formatFecha(fechaCitvVenc),
    responsable: 'auto',
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    vehiculo_id: VEHICULO_DEFAULT.id,
    tipo_documento: 'LicenciaConducir',
    nombre_identificador: 'Licencia de Conducir Brevete MTC (A-I)',
    numero_documento: 'Q-45892104',
    entidad_emisora: 'Ministerio de Transportes y Comunicaciones',
    fecha_emision: '2019-09-30',
    fecha_vencimiento: formatFecha(fechaBreveteVenc),
    responsable: 'conductor',
  },
];

const MANTENIMIENTOS_DEFAULT: Mantenimiento[] = [
  {
    id: 'm1111111-1111-1111-1111-111111111111',
    vehiculo_id: VEHICULO_DEFAULT.id,
    fecha: '2024-07-15',
    kilometraje: 45000,
    tipo: 'preventivo',
    categoria: 'aceite',
    costo: 185.0,
    taller: 'Lubricentro Express Surquillo',
    notas: 'Cambio de aceite y filtro original. Arandela cárter nueva.',
    proximo_servicio_km: 55000,
    proximo_servicio_fecha: '2025-07-15',
    aceite_marca: 'Motul',
    aceite_modelo: '8100 X-cess Gen2',
    aceite_viscosidad: '5W-30',
    aceite_tipo: 'sintetico',
  },
  {
    id: 'm2222222-2222-2222-2222-222222222222',
    vehiculo_id: VEHICULO_DEFAULT.id,
    fecha: '2024-05-10',
    kilometraje: 43200,
    tipo: 'correctivo',
    categoria: 'frenos',
    costo: 240.0,
    taller: 'Frenos & Embragues del Perú',
    notas: 'Cambio de pastillas delanteras de cerámica y rectificado de discos.',
    proximo_servicio_km: null,
    proximo_servicio_fecha: null,
  },
  {
    id: 'm3333333-3333-3333-3333-333333333333',
    vehiculo_id: VEHICULO_DEFAULT.id,
    fecha: '2024-01-20',
    kilometraje: 40000,
    tipo: 'preventivo',
    categoria: 'bateria',
    costo: 320.0,
    taller: 'Baterías ETNA San Borja',
    notas: 'Instalación de batería ETNA Platinum 13 placas libre mantenimiento.',
    proximo_servicio_km: null,
    proximo_servicio_fecha: null,
  },
];

export async function obtenerVehiculoPrincipal(): Promise<Vehiculo> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('vehiculos').select('*').limit(1);

    if (error || !data || data.length === 0) {
      return VEHICULO_DEFAULT;
    }

    const vehiculoActual = data[0] as Vehiculo;

    // Sincronización inteligente: Si el desarrollador/usuario actualizó la placa o modelo
    // en constants (o .env), sincronizar automáticamente en la base de datos de Supabase.
    if (
      DEFAULT_VEHICULO.placa &&
      (DEFAULT_VEHICULO.placa !== vehiculoActual.placa ||
        DEFAULT_VEHICULO.marca !== vehiculoActual.marca ||
        DEFAULT_VEHICULO.modelo !== vehiculoActual.modelo ||
        DEFAULT_VEHICULO.anio !== vehiculoActual.anio)
    ) {
      const { data: actualizado } = await supabase
        .from('vehiculos')
        .update({
          placa: DEFAULT_VEHICULO.placa,
          marca: DEFAULT_VEHICULO.marca,
          modelo: DEFAULT_VEHICULO.modelo,
          anio: DEFAULT_VEHICULO.anio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', vehiculoActual.id)
        .select()
        .single();

      if (actualizado) {
        return actualizado as Vehiculo;
      }
    }

    return vehiculoActual;
  } catch {
    return VEHICULO_DEFAULT;
  }
}

export async function obtenerDocumentosVehiculo(vehiculoId: string): Promise<DocumentoConEstado[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .or(`vehiculo_id.eq.${vehiculoId},vehiculo_id.is.null`)
      .order('fecha_vencimiento', { ascending: true });

    if (error || !data || data.length === 0) {
      return DOCUMENTOS_DEFAULT.map(enriquecerDocumento);
    }

    return (data as Documento[]).map(enriquecerDocumento);
  } catch {
    return DOCUMENTOS_DEFAULT.map(enriquecerDocumento);
  }
}

export async function obtenerMantenimientosVehiculo(vehiculoId: string): Promise<Mantenimiento[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('mantenimientos')
      .select('*')
      .eq('vehiculo_id', vehiculoId)
      .order('fecha', { ascending: false });

    if (error || !data || data.length === 0) {
      return MANTENIMIENTOS_DEFAULT;
    }

    return data as Mantenimiento[];
  } catch {
    return MANTENIMIENTOS_DEFAULT;
  }
}

export async function obtenerEstadoGeneralApp() {
  const vehiculo = await obtenerVehiculoPrincipal();
  const [documentos, mantenimientos] = await Promise.all([
    obtenerDocumentosVehiculo(vehiculo.id),
    obtenerMantenimientosVehiculo(vehiculo.id),
  ]);

  const ultimoConProximoKm = mantenimientos.find((m) => m.proximo_servicio_km != null);
  const alertaKm = evaluarAlertaKilometraje(
    vehiculo.kilometraje_actual,
    ultimoConProximoKm?.proximo_servicio_km
  );

  const docsCriticos = documentos.filter(
    (d) => d.estado_semaforo === 'amarillo' || d.estado_semaforo === 'rojo'
  );

  const gastoTotal = mantenimientos.reduce((acc, m) => acc + Number(m.costo || 0), 0);

  return {
    vehiculo,
    documentos,
    mantenimientos,
    alertaKm,
    docsCriticos,
    gastoTotal,
    ultimoMantenimiento: mantenimientos[0] || null,
  };
}
