import { Router } from 'express';
import {
  submitContactMessage,
  getAllContactMessagesAdmin,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { requireAdminAuth } from '../middlewares/auth.js';

const router = Router();

// ==========================================
// Rutas Públicas (Envío de Formularios)
// ==========================================
router.post('/', submitContactMessage);

// ==========================================
// Rutas Protegidas (Backoffice / Admin)
// ==========================================
router.get('/admin/all', requireAdminAuth, getAllContactMessagesAdmin);
router.patch('/admin/:id/status', requireAdminAuth, updateContactMessageStatus);
router.delete('/admin/:id', requireAdminAuth, deleteContactMessage);

export default router;
