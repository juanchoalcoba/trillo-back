import { Router } from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { requireAdminAuth } from '../middlewares/auth.js';

const router = Router();

// Rutas públicas de autenticación
router.post('/login', login);
router.post('/logout', logout);

// Rutas protegidas (requieren JWT en cookie o header)
router.get('/me', requireAdminAuth, getMe);

export default router;
