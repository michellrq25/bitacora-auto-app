import { TipoDocumento, ResponsableDocumento } from '../types/documento.types';

export interface DocumentoNormativoMeta {
  tipo: TipoDocumento;
  nombreOficial: string;
  responsable: ResponsableDocumento;
  autoridadReguladora: string;
  vigenciaDefectoMeses: number;
  entidadesSugeridas: string[];
  descripcion: string;
}

/**
 * Constantes y catálogos normativos oficiales de Perú (MTC, SBS, CITV)
 */
export const DOCUMENTOS_NORMATIVOS_PERU: Record<
  TipoDocumento,
  DocumentoNormativoMeta
> = {
  SOAT: {
    tipo: 'SOAT',
    nombreOficial: 'Seguro Obligatorio de Accidentes de Tránsito (SOAT)',
    responsable: 'auto',
    autoridadReguladora: 'Superintendencia de Banca y Seguros (SBS) / MTC',
    vigenciaDefectoMeses: 12,
    entidadesSugeridas: [
      'La Positiva Seguros',
      'Rímac Seguros',
      'Pacífico Seguros',
      'Mapfre Perú',
      'Interseguro',
      'Crecer Seguros',
      'Protecta Security',
    ],
    descripcion: 'Obligatorio por ley para transitar por el territorio nacional.',
  },
  RevisionTecnica: {
    tipo: 'RevisionTecnica',
    nombreOficial: 'Inspección Técnica Vehicular (CITV)',
    responsable: 'auto',
    autoridadReguladora: 'Ministerio de Transportes y Comunicaciones (MTC)',
    vigenciaDefectoMeses: 12,
    entidadesSugeridas: [
      'Farenet',
      'Lidercon Perú',
      'Cedit',
      'Revitec',
      'CITV Express',
      'Certirev',
      'I.T.V. CAMBRIDGE S.A.C.'
    ],
    descripcion: 'Certifica las condiciones de seguridad mecánica y control de emisiones.',
  },
  LicenciaConducir: {
    tipo: 'LicenciaConducir',
    nombreOficial: 'Licencia de Conducir Brevete MTC',
    responsable: 'conductor',
    autoridadReguladora: 'Ministerio de Transportes y Comunicaciones (MTC)',
    vigenciaDefectoMeses: 60, // 5 a 10 años según récord de puntos
    entidadesSugeridas: [
      'Ministerio de Transportes y Comunicaciones (MTC)',
      'Gobierno Regional (Callao / Regiones)',
      'Touring y Automóvil Club del Perú',
    ],
    descripcion: 'Autorización legal para conducir vehículos en el territorio peruano.',
  },
  Otro: {
    tipo: 'Otro',
    nombreOficial: 'Documento Adicional o Póliza Particular',
    responsable: 'auto',
    autoridadReguladora: 'Particular',
    vigenciaDefectoMeses: 12,
    entidadesSugeridas: ['Compañía de Seguros', 'Entidad Certificadora'],
    descripcion: 'Seguro contra todo riesgo, certificado GLP/GNV, etc.',
  },
};

/**
 * Categorías de Licencia de Conducir (Brevete) según el Reglamento Nacional de Licencias
 */
export const CATEGORIAS_BREVETE_MTC = [
  { categoria: 'A-I', descripcion: 'Particular (Autos, camionetas, SUVs, hatchbacks)' },
  { categoria: 'A-IIa', descripcion: 'Servicio especial (Taxi, escolar, turismo)' },
  { categoria: 'A-IIb', descripcion: 'Microbuses y camiones hasta 12 toneladas' },
  { categoria: 'A-IIIa', descripcion: 'Ómnibus y transporte interprovincial de pasajeros' },
  { categoria: 'A-IIIb', descripcion: 'Camiones pesados de carga de más de 12 toneladas' },
  { categoria: 'A-IIIc', descripcion: 'Tráilers y vehículos articulados (Carga pesada)' },
] as const;

/**
 * Entidades aseguradoras registradas en SBS para SOAT en Perú
 */
export const ASEGURADORAS_SOAT_PERU = DOCUMENTOS_NORMATIVOS_PERU.SOAT.entidadesSugeridas;

/**
 * Plantas autorizadas de Inspección Técnica Vehicular (CITV)
 */
export const PLANTAS_CITV_PERU = DOCUMENTOS_NORMATIVOS_PERU.RevisionTecnica.entidadesSugeridas;
