/**
 * Manejador global de errores para la API de Trillo.
 * Devuelve respuestas formateadas uniformemente en JSON.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';

  console.error(`[Error] [${req.method}] ${req.originalUrl} - ${statusCode}:`, err.message);

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  });
}

/**
 * Manejador de rutas no encontradas (404)
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
      code: 'NOT_FOUND',
    },
  });
}

export default { errorHandler, notFoundHandler };
