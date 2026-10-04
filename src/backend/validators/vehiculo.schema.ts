import { z } from 'zod';
import { REGEX_PLACA_PERU, normalizarPlaca } from '@/shared/constants';

export const vehiculoPlacaSchema = z
  .string()
  .min(6, 'La placa debe tener al menos 6 caracteres')
  .max(8, 'La placa no puede exceder 8 caracteres')
  .transform((val) => normalizarPlaca(val))
  .refine((val) => REGEX_PLACA_PERU.test(val), {
    message: 'Formato de placa inválido. Ejemplo válido: ABC-123 o A1B-123',
  });

export const registrarVehiculoSchema = z.object({
  placa: vehiculoPlacaSchema,
  marca: z.string().min(2, 'La marca es requerida'),
  modelo: z.string().min(1, 'El modelo es requerido'),
  anio: z.coerce
    .number()
    .int()
    .min(1980, 'Año no válido')
    .max(new Date().getFullYear() + 1, 'El año no puede ser superior al siguiente'),
  kilometraje_actual: z.coerce
    .number()
    .int()
    .min(0, 'El kilometraje no puede ser negativo')
    .max(1500000, 'Kilometraje fuera de rango razonable'),
});

export type RegistrarVehiculoInput = z.infer<typeof registrarVehiculoSchema>;
