import { z } from 'zod';

export const actualizarOdometroSchema = z.object({
  vehiculo_id: z.string().uuid('ID de vehículo inválido'),
  nuevo_kilometraje: z.coerce
    .number()
    .int('Debe ser un número entero')
    .min(0, 'El kilometraje no puede ser negativo')
    .max(1500000, 'Kilometraje fuera de rango razonable'),
});

export type ActualizarOdometroInput = z.infer<typeof actualizarOdometroSchema>;
