'use server';

import { createServiceRoleClient } from '@/backend/db/service-role';
import { enriquecerDocumento, evaluarAlertaKilometraje } from '@/backend/services/alerta.service';
import {
  enviarMensajeTelegram,
  generarReporteAlertasHTML,
} from '@/backend/services/notificaciones.service';
import { Vehiculo } from '@/shared/types/vehiculo.types';
import { Documento } from '@/shared/types/documento.types';
import { Mantenimiento } from '@/shared/types/mantenimiento.types';

export async function enviarAlertaManualAction(): Promise<{
  success: boolean;
  enviada?: boolean;
  message?: string;
  error?: string;
}> {
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
        error: 'No se encontró el vehículo en la base de datos.',
      };
    }

    const vehiculo: Vehiculo = vehiculos[0];

    // 2. Obtener Documentos del vehículo y conductor
    const { data: documentos, error: docsError } = await supabase
      .from('documentos')
      .select('*')
      .or(`vehiculo_id.eq.${vehiculo.id},vehiculo_id.is.null`);

    if (docsError) {
      return { success: false, error: docsError.message };
    }

    // 3. Obtener Último Mantenimiento
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

    // 4. Evaluar Alertas
    const alertaKm = evaluarAlertaKilometraje(
      vehiculo.kilometraje_actual,
      ultimoMantenimiento?.proximo_servicio_km
    );

    const docsTipados = (documentos as Documento[]) || [];
    const docsConEstado = docsTipados.map(enriquecerDocumento);

    const documentosCriticos = docsConEstado.filter(
      (d) => d.estado_semaforo === 'amarillo' || d.estado_semaforo === 'rojo'
    );

    const hayNovedades = documentosCriticos.length > 0 || alertaKm.tieneAlerta;

    // 5. Generar y Enviar a Telegram
    const htmlMensaje = generarReporteAlertasHTML({
      vehiculo,
      documentosCriticos: hayNovedades ? documentosCriticos : docsConEstado,
      alertaKilometraje: alertaKm,
    });

    const resultado = await enviarMensajeTelegram(htmlMensaje);

    if (resultado.success) {
      return {
        success: true,
        enviada: true,
        message: '¡Reporte enviado exitosamente a tu chat de Telegram!',
      };
    } else {
      return {
        success: false,
        error: resultado.error || 'No se pudo entregar el mensaje a Telegram.',
      };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error inesperado';
    return { success: false, error: errorMsg };
  }
}
