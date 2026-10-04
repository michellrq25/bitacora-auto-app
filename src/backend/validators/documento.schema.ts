import { z } from 'zod';

export const renovarDocumentoSchema = z.object({
  documento_id: z.string().uuid('ID de documento inválido'),
  nueva_fecha_emision: z.string().min(1, 'La fecha de emisión es obligatoria'),
  nueva_fecha_vencimiento: z.string().min(1, 'La fecha de vencimiento es obligatoria'),
  nuevo_numero_documento: z.string().optional().nullable(),
  nuevo_nombre_identificador: z.string().optional().nullable(),
  nueva_entidad_emisora: z.string().optional().nullable(),
});

export type RenovarDocumentoInput = z.infer<typeof renovarDocumentoSchema>;
