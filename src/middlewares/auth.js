import jwt from 'jsonwebtoken';

/**
 * Middleware para proteger rutas del Backoffice.
 * Valida el JWT desde la cookie HttpOnly 'trillo_admin_token' o header Authorization.
 */
export function requireAdminAuth(req, res, next) {
  // 1. Obtener token desde Cookie o Bearer Header
  let token = req.cookies?.trillo_admin_token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Acceso no autorizado. Debe iniciar sesión en el Backoffice.',
        code: 'AUTH_REQUIRED',
      },
    });
  }

  // 2. Verificar firma y vigencia del JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // { id, email, role, name }
    next();
  } catch (err) {
    let message = 'Sesión inválida o manipulada.';
    let code = 'TOKEN_INVALID';

    if (err.name === 'TokenExpiredError') {
      message = 'La sesión administrativa ha expirado. Ingrese nuevamente.';
      code = 'TOKEN_EXPIRED';
    }

    return res.status(401).json({
      success: false,
      error: {
        message,
        code,
      },
    });
  }
}

export default requireAdminAuth;
