import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const COOKIE_NAME = 'trillo_admin_token';
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Debe ingresar email y contraseña.',
          code: 'MISSING_FIELDS',
        },
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // 1. Buscar administrador en PostgreSQL
    const userRes = await query(
      `SELECT id, email, password_hash, name, role, is_active 
       FROM admin_users 
       WHERE email = $1`,
      [normalizedEmail]
    );

    const user = userRes.rows[0];

    // Protección de tiempo contra ataques de enumeración de usuarios
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Credenciales inválidas.',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }

    // 2. Comparar contraseña con el hash bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Credenciales inválidas.',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }

    // 3. Generar token JWT
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });

    // 4. Configurar Cookie HttpOnly
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax', // 'none' permite cookies cross-site seguras en producción si los subdominios difieren
      maxAge: EIGHT_HOURS_MS,
      path: '/',
    });

    // 5. Actualizar último acceso de forma asíncrona
    query('UPDATE admin_users SET last_login_at = NOW() WHERE id = $1', [user.id]).catch(() => {});

    // 6. Responder con datos públicos del usuario
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token, // Provisto también en el body como fallback
    });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  res.json({
    success: true,
    message: 'Sesión administrativa cerrada exitosamente.',
  });
}

export async function getMe(req, res, next) {
  try {
    const adminId = req.admin?.id;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: { message: 'No autenticado.', code: 'UNAUTHORIZED' },
      });
    }

    const userRes = await query(
      `SELECT id, email, name, role, last_login_at, created_at 
       FROM admin_users 
       WHERE id = $1 AND is_active = true`,
      [adminId]
    );

    const user = userRes.rows[0];
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'Usuario no encontrado o inactivo.', code: 'USER_NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
}

export default { login, logout, getMe };
