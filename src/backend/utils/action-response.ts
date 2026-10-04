import { ZodError } from 'zod';

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Normaliza los errores capturados en Server Actions para retornar
 * un formato estándar y amigable para el cliente.
 */
export function handleActionError<T = unknown>(
  error: unknown,
  fallbackMessage = 'Ocurrió un error inesperado.'
): ActionResponse<T> {
  if (error instanceof ZodError) {
    const primerError = error.issues[0];
    const campo = primerError?.path?.length ? primerError.path.join('.') : '';
    const detalle = primerError?.message || 'Error en los datos ingresados.';
    return {
      success: false,
      error: campo ? `${campo}: ${detalle}` : detalle,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: false,
    error: fallbackMessage,
  };
}
