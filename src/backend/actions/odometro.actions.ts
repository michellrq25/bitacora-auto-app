'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/backend/db/server';
import {
  actualizarOdometroSchema,
  ActualizarOdometroInput,
} from '@/backend/validators/odometro.schema';

export async function actualizarOdometroAction(input: ActualizarOdometroInput) {
  try {
    const validado = actualizarOdometroSchema.parse(input);
    const supabase = createClient();

    let targetId = validado.vehiculo_id;
    const { data: existe } = await supabase
      .from('vehiculos')
      .select('id')
      .eq('id', targetId)
      .maybeSingle();

    if (!existe) {
      const { data: vPrincipal } = await supabase
        .from('vehiculos')
        .select('id')
        .limit(1)
        .maybeSingle();
      if (vPrincipal) targetId = vPrincipal.id;
    }

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
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Error al actualizar el kilometraje del odómetro.' };
  }
}
