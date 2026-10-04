'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/backend/db/server';
import {
  actualizarOdometroSchema,
  ActualizarOdometroInput,
} from '@/backend/validators/odometro.schema';
import { resolverVehiculoId } from '@/backend/services/datos.service';
import { ActionResponse, handleActionError } from '@/backend/utils/action-response';
import { Vehiculo } from '@/shared/types/vehiculo.types';

export async function actualizarOdometroAction(
  input: ActualizarOdometroInput
): Promise<ActionResponse<Vehiculo>> {
  try {
    const validado = actualizarOdometroSchema.parse(input);
    const supabase = createClient();
    const targetId = await resolverVehiculoId(supabase, validado.vehiculo_id);

    const { data, error } = await supabase
      .from('vehiculos')
      .update({
        kilometraje_actual: validado.nuevo_kilometraje,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetId)
      .select()
      .single();

    if (error) {
      console.error('[Action Error] Error actualizando odómetro:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/mantenimientos');
    return { success: true, data: data as Vehiculo };
  } catch (error) {
    return handleActionError(error, 'Error al actualizar el kilometraje del odómetro.');
  }
}
