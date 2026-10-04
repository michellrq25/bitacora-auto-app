import { z } from 'zod';

export const nuevoMantenimientoSchema = z
  .object({
    vehiculo_id: z.string().uuid('ID de vehículo inválido'),
    fecha: z.string().min(1, 'La fecha es obligatoria'),
    kilometraje: z.coerce.number().min(0, 'El kilometraje debe ser mayor o igual a 0'),
    tipo: z.enum(['preventivo', 'correctivo'], {
      required_error: 'Debe seleccionar preventivo o correctivo',
    }),
    categoria: z.enum([
      'aceite',
      'frenos',
      'neumaticos',
      'bateria',
      'refrigeracion',
      'general',
    ]),
    costo: z.coerce.number().min(0, 'El costo no puede ser negativo'),
    taller: z.string().optional().nullable(),
    notas: z.string().optional().nullable(),
    proximo_servicio_km: z.coerce.number().optional().nullable(),
    proximo_servicio_fecha: z.string().optional().nullable(),

    // Campos condicionales de lubricantes
    aceite_marca: z.string().optional().nullable(),
    aceite_modelo: z.string().optional().nullable(),
    aceite_viscosidad: z.string().optional().nullable(),
    aceite_tipo: z.enum(['sintetico', 'semi-sintetico', 'mineral']).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // Si la categoría es aceite, validar que los campos de aceite sean proporcionados
    if (data.categoria === 'aceite') {
      if (!data.aceite_tipo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Debe seleccionar el tipo de aceite (sintético, semi o mineral)',
          path: ['aceite_tipo'],
        });
      }
      if (!data.aceite_viscosidad || data.aceite_viscosidad.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La viscosidad (ej. 5W-30) es obligatoria para cambios de aceite',
          path: ['aceite_viscosidad'],
        });
      }
    }
  });

export type NuevoMantenimientoInput = z.infer<typeof nuevoMantenimientoSchema>;
