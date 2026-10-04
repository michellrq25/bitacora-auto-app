import { Documento, DocumentoConEstado } from '@/shared/types/documento.types';
import { Vehiculo } from '@/shared/types/vehiculo.types';
import { Mantenimiento } from '@/shared/types/mantenimiento.types';
import { formatearKilometraje, LOCALE_PERU } from '@/shared/constants';
import { createServiceRoleClient } from '@/backend/db/service-role';
import { enriquecerDocumento, evaluarAlertaKilometraje } from '@/backend/services/alerta.service';

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

export interface ReporteAlertasResultado {
  success: boolean;
  timestamp: string;
  vehiculo?: {
    placa: string;
    kilometraje: number;
    marca: string;
    modelo: string;
  };
  resumen?: {
    totalDocumentos: number;
    criticos: number;
    alertaKilometraje: boolean;
  };
  notificacion?: {
    enviada: boolean;
    error: string | null;
  };
  message?: string;
  error?: string;
}

/**
 * Pipeline centralizado para evaluar el estado del vehículo y sus documentos,
 * generar el reporte formateado y despacharlo a Telegram.
 * Reutilizado tanto por el cron job automatizado como por la Server Action manual.
 */
export async function procesarYEnviarAlertasReporte(): Promise<ReporteAlertasResultado> {
  const timestamp = new Date().toISOString();

  try {
    const supabase = createServiceRoleClient();

    // 1. Obtener Vehículo Principal
    const { data: vehiculos, error: vehiculosError } = await supabase
      .from('vehiculos')
      .select('*')
      .limit(1);

    if (vehiculosError || !vehiculos || vehiculos.length === 0) {
      return {
        success: false,
        timestamp,
        error: 'No se encontraron vehículos registrados para evaluar.',
      };
    }

    const vehiculo: Vehiculo = vehiculos[0];

    // 2. Obtener Documentos del vehículo y conductor
    const { data: documentos, error: docsError } = await supabase
      .from('documentos')
      .select('*')
      .or(`vehiculo_id.eq.${vehiculo.id},vehiculo_id.is.null`);

    if (docsError) {
      return {
        success: false,
        timestamp,
        error: docsError.message,
      };
    }

    // 3. Obtener Último Mantenimiento para comprobar próximo servicio
    const { data: ultimosMantenimientos } = await supabase
      .from('mantenimientos')
      .select('*')
      .eq('vehiculo_id', vehiculo.id)
      .not('proximo_servicio_km', 'is', null)
      .order('fecha', { ascending: false })
      .limit(1);

    const ultimoMantenimiento: Mantenimiento | undefined =
      ultimosMantenimientos && ultimosMantenimientos.length > 0
        ? ultimosMantenimientos[0]
        : undefined;

    // 4. Evaluar Alerta por Kilometraje
    const alertaKm = evaluarAlertaKilometraje(
      vehiculo.kilometraje_actual,
      ultimoMantenimiento?.proximo_servicio_km
    );

    // 5. Evaluar Documentos (Semáforo)
    const docsTipados = (documentos as Documento[]) || [];
    const docsConEstado = docsTipados.map(enriquecerDocumento);

    const documentosCriticos = docsConEstado.filter(
      (d) => d.estado_semaforo === 'amarillo' || d.estado_semaforo === 'rojo'
    );

    const hayNovedades = documentosCriticos.length > 0 || alertaKm.tieneAlerta;

    // 6. Generar y Enviar a Telegram
    const htmlMensaje = generarReporteAlertasHTML({
      vehiculo,
      documentosCriticos: hayNovedades ? documentosCriticos : docsConEstado,
      alertaKilometraje: alertaKm,
    });

    const resultadoTelegram = await enviarMensajeTelegram(htmlMensaje);

    return {
      success: resultadoTelegram.success,
      timestamp,
      vehiculo: {
        placa: vehiculo.placa,
        kilometraje: vehiculo.kilometraje_actual,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
      },
      resumen: {
        totalDocumentos: docsConEstado.length,
        criticos: documentosCriticos.length,
        alertaKilometraje: alertaKm.tieneAlerta,
      },
      notificacion: {
        enviada: resultadoTelegram.success,
        error: resultadoTelegram.error || null,
      },
      message: resultadoTelegram.success
        ? '¡Reporte enviado exitosamente a tu chat de Telegram!'
        : undefined,
      error: resultadoTelegram.error,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error inesperado';
    return {
      success: false,
      timestamp,
      error: errorMsg,
    };
  }
}
