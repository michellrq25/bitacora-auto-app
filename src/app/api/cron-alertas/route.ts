import { NextRequest, NextResponse } from 'next/server';
import { procesarYEnviarAlertasReporte } from '@/backend/services/notificaciones.service';

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

    // 2. Ejecutar pipeline unificado de evaluación y notificación
    const resultado = await procesarYEnviarAlertasReporte();

    return NextResponse.json(resultado, {
      status: resultado.success ? 200 : 500,
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
