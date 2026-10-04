'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/backend/db/server';
import {
  renovarDocumentoSchema,
  RenovarDocumentoInput,
} from '@/backend/validators/documento.schema';
import { ActionResponse, handleActionError } from '@/backend/utils/action-response';
import { Documento } from '@/shared/types/documento.types';

export async function renovarDocumentoAction(
  input: RenovarDocumentoInput
): Promise<ActionResponse<Documento>> {
  try {
    const validado = renovarDocumentoSchema.parse(input);
    const supabase = createClient();

    const updatePayload: Record<string, unknown> = {
      fecha_emision: validado.nueva_fecha_emision,
      fecha_vencimiento: validado.nueva_fecha_vencimiento,
      numero_documento: validado.nuevo_numero_documento || null,
      updated_at: new Date().toISOString(),
    };

    if (validado.nuevo_nombre_identificador) {
      updatePayload.nombre_identificador = validado.nuevo_nombre_identificador;
    }

    if (validado.nueva_entidad_emisora !== undefined) {
      updatePayload.entidad_emisora = validado.nueva_entidad_emisora || null;
    }

    const { data, error } = await supabase
      .from('documentos')
      .update(updatePayload)
      .eq('id', validado.documento_id)
      .select()
      .single();

    if (error) {
      console.error('[Action Error] Error renovando documento:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/documentos');
    return { success: true, data: data as Documento };
  } catch (error) {
    return handleActionError(error, 'Error al renovar el documento.');
  }
}
