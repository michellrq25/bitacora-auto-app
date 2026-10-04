'use server';

import {
  procesarYEnviarAlertasReporte,
  ReporteAlertasResultado,
} from '@/backend/services/notificaciones.service';
import { ActionResponse, handleActionError } from '@/backend/utils/action-response';

/**
 * Server Action para disparar manualmente el envío del reporte a Telegram
 * desde la interfaz de usuario sin exponer tokens ni CRON_SECRET en el cliente.
 */
export async function enviarAlertaManualAction(): Promise<
  ActionResponse<ReporteAlertasResultado>
> {
  try {
    const resultado = await procesarYEnviarAlertasReporte();

    if (!resultado.success) {
      return {
        success: false,
        error: resultado.error || 'No se pudo entregar el mensaje a Telegram.',
      };
    }

    return {
      success: true,
      data: resultado,
      message: resultado.message || '¡Reporte enviado exitosamente a tu chat de Telegram!',
    };
  } catch (error) {
    return handleActionError(error, 'Error al ejecutar el servicio de alertas.');
  }
}
