import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/backend/db/service-role';
import { enriquecerDocumento, evaluarAlertaKilometraje } from '@/backend/services/alerta.service';
import {
  enviarMensajeTelegram,
  generarReporteAlertasHTML,
} from '@/backend/services/notificaciones.service';
import { Vehiculo } from '@/shared/types/vehiculo.types';
import { Documento } from '@/shared/types/documento.types';
import { Mantenimiento } from '@/shared/types/mantenimiento.types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. Verificación de Seguridad CRON_SECRET
    const authHeader = request.headers.get('authorization');
    const querySecret = request.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.CRON_SECRET;

    const tokenFromBearer = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    const providedToken = tokenFromBearer || querySecret;

    if (expectedSecret && providedToken !== expectedSecret) {
      return NextResponse.json(
        { error: 'No autorizado. CRON_SECRET inválido o ausente.' },
        { status: 401 }
      );
    }

    const supabase = createServiceRoleClient();

    // 2. Obtener Vehículo Principal
    const { data: vehiculos, error: vehiculosError } = await supabase
      .from('vehiculos')
      .select('*')
      .limit(1);

    if (vehiculosError || !vehiculos || vehiculos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No se encontraron vehículos registrados para evaluar.',
          error: vehiculosError?.message,
        },
        { status: 404 }
      );
    }

    const vehiculo: Vehiculo = vehiculos[0];

    // 3. Obtener Documentos del vehículo y conductor
    const { data: documentos, error: docsError } = await supabase
      .from('documentos')
      .select('*')
      .or(`vehiculo_id.eq.${vehiculo.id},vehiculo_id.is.null`);

    if (docsError) {
      return NextResponse.json(
        { success: false, error: docsError.message },
        { status: 500 }
      );
    }

    // 4. Obtener Último Mantenimiento para comprobar próximo servicio
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

    // 5. Evaluar Alerta por Kilometraje
    const alertaKm = evaluarAlertaKilometraje(
      vehiculo.kilometraje_actual,
      ultimoMantenimiento?.proximo_servicio_km
    );

    // 6. Evaluar Documentos (Semáforo)
    const docsTipados = (documentos as Documento[]) || [];
    const docsConEstado = docsTipados.map(enriquecerDocumento);

    // Identificar documentos en estado crítico (amarillo o rojo)
    const documentosCriticos = docsConEstado.filter(
      (d) => d.estado_semaforo === 'amarillo' || d.estado_semaforo === 'rojo'
    );

    // 7. Enviar Alerta a Telegram
    // Se envía si hay documentos críticos (amarillo/rojo) o si el odómetro activó alerta
    const hayNovedades = documentosCriticos.length > 0 || alertaKm.tieneAlerta;

    const htmlMensaje = generarReporteAlertasHTML({
      vehiculo,
      documentosCriticos: hayNovedades ? documentosCriticos : docsConEstado,
      alertaKilometraje: alertaKm,
    });

    const resultadoTelegram = await enviarMensajeTelegram(htmlMensaje);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      vehiculo: {
        placa: vehiculo.placa,
        kilometraje: vehiculo.kilometraje_actual,
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
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error inesperado';
    console.error('[Cron Alertas API Error]:', error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
