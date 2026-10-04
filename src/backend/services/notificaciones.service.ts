import { DocumentoConEstado } from '@/shared/types/documento.types';
import { Vehiculo } from '@/shared/types/vehiculo.types';
import { formatearKilometraje, LOCALE_PERU } from '@/shared/constants';

interface TelegramSendResponse {
  ok: boolean;
  description?: string;
  result?: unknown;
}

/**
 * Envía un mensaje en formato HTML a Telegram usando la API REST directa de Telegram Bot.
 * No requiere librerías ni SDKs adicionales.
 */
export async function enviarMensajeTelegram(
  htmlContent: string
): Promise<{ success: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    const errorMsg = 'Variables TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configuradas en el entorno.';
    console.warn(`[Telegram Service] ${errorMsg}`);
    return { success: false, error: errorMsg };
  }

  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlContent,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data: TelegramSendResponse = await response.json();

    if (!data.ok) {
      console.error('[Telegram Service] Error en respuesta de Telegram:', data.description);
      return { success: false, error: data.description || 'Error desconocido de Telegram API' };
    }

    return { success: true };
  } catch (error) {
    const errorStr = error instanceof Error ? error.message : 'Fallo en la conexión con Telegram';
    console.error('[Telegram Service] Excepción al despachar mensaje:', errorStr);
    return { success: false, error: errorStr };
  }
}

/**
 * Genera el reporte formateado en HTML para el resumen diario de alertas
 * del vehículo (Documentos Normativos Perú + Odómetro/Mantenimiento).
 */
export function generarReporteAlertasHTML(params: {
  vehiculo: Vehiculo;
  documentosCriticos: DocumentoConEstado[];
  alertaKilometraje?: { tieneAlerta: boolean; mensaje: string; kmFaltantes: number } | null;
}): string {
  const { vehiculo, documentosCriticos, alertaKilometraje } = params;
  const fechaHoy = new Date().toLocaleDateString(LOCALE_PERU, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Lima',
  });

  let mensaje = `🚗 <b>BITÁCORA AUTO PERÚ</b> | <i>Reporte Diario</i>\n`;
  mensaje += `📅 <b>Fecha:</b> ${fechaHoy}\n`;
  mensaje += `🚘 <b>Vehículo:</b> ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anio})\n`;
  mensaje += `🔢 <b>Placa:</b> <code>${vehiculo.placa}</code>\n`;
  mensaje += `⏱ <b>Odómetro Actual:</b> ${formatearKilometraje(vehiculo.kilometraje_actual)}\n\n`;

  // Sección Alertas de Mantenimiento por Odómetro
  if (alertaKilometraje && alertaKilometraje.tieneAlerta) {
    mensaje += `🔧 <b>ALERTA DE MANTENIMIENTO:</b>\n`;
    mensaje += `⚠️ ${alertaKilometraje.mensaje}\n\n`;
  }

  // Sección Documentos Normativos
  mensaje += `📋 <b>ESTADO DE DOCUMENTOS NORMATIVOS:</b>\n`;

  if (documentosCriticos.length === 0) {
    mensaje += `✅ <i>Todos los documentos (SOAT, CITV, Brevete) se encuentran vigentes.</i>\n`;
  } else {
    documentosCriticos.forEach((doc) => {
      const emoji =
        doc.estado_semaforo === 'rojo'
          ? '🔴'
          : doc.estado_semaforo === 'amarillo'
          ? '🟡'
          : '🟢';

      const tagResponsable = doc.responsable === 'auto' ? '[Auto]' : '[Conductor]';

      mensaje += `${emoji} <b>${doc.nombre_identificador}</b> ${tagResponsable}\n`;
      if (doc.numero_documento) {
        mensaje += `   • Nro: <code>${doc.numero_documento}</code>\n`;
      }
      mensaje += `   • Vence: <b>${doc.fecha_vencimiento}</b>\n`;
      mensaje += `   • Situación: <b>${doc.estado_etiqueta.toUpperCase()}</b>\n\n`;
    });
  }

  mensaje += `\n🔗 <i>Gestiona tu bitácora desde la app web móvil.</i>`;
  return mensaje;
}
