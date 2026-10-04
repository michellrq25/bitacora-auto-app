'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/backend/db/server';
import {
  nuevoMantenimientoSchema,
  NuevoMantenimientoInput,
} from '@/backend/validators/mantenimiento.schema';

export async function registrarMantenimientoAction(input: NuevoMantenimientoInput) {
  try {
    // 1. Validar esquema con Zod
    const validado = nuevoMantenimientoSchema.parse(input);

    const supabase = createClient();

    // 1.5 Resolver ID de vehículo real en base de datos
    let targetVehiculoId = validado.vehiculo_id;
    const { data: vehiculoExiste } = await supabase
      .from('vehiculos')
      .select('id')
      .eq('id', targetVehiculoId)
      .maybeSingle();

    if (!vehiculoExiste) {
      const { data: vPrincipal } = await supabase
        .from('vehiculos')
        .select('id')
        .limit(1)
        .maybeSingle();
      if (vPrincipal) {
        targetVehiculoId = vPrincipal.id;
      }
    }

    // 2. Insertar registro en tabla mantenimientos
    const { data: nuevoRegistro, error: insertError } = await supabase
      .from('mantenimientos')
      .insert({
        vehiculo_id: targetVehiculoId,
        fecha: validado.fecha,
        kilometraje: validado.kilometraje,
        tipo: validado.tipo,
        categoria: validado.categoria,
        costo: validado.costo,
        taller: validado.taller || null,
        notas: validado.notas || null,
        proximo_servicio_km: validado.proximo_servicio_km || null,
        proximo_servicio_fecha: validado.proximo_servicio_fecha || null,
        aceite_marca: validado.aceite_marca || null,
        aceite_modelo: validado.aceite_modelo || null,
        aceite_viscosidad: validado.aceite_viscosidad || null,
        aceite_tipo: validado.aceite_tipo || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Action Error] Error insertando mantenimiento en Supabase:', insertError);
      return { success: false, error: insertError.message };
    }

    // 3. Regla de Negocio: Si el kilometraje registrado es mayor al actual, actualizar odómetro
    const { data: vehiculo } = await supabase
      .from('vehiculos')
      .select('kilometraje_actual')
      .eq('id', targetVehiculoId)
      .single();

    if (vehiculo && validado.kilometraje > vehiculo.kilometraje_actual) {
      await supabase
        .from('vehiculos')
        .update({
          kilometraje_actual: validado.kilometraje,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetVehiculoId);
    }

    // 4. Revalidar vistas afectadas
    revalidatePath('/');
    revalidatePath('/mantenimientos');

    return { success: true, data: nuevoRegistro };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Ocurrió un error inesperado al registrar el servicio.' };
  }
}
