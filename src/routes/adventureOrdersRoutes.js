import { Router } from 'express';
import {
  submitAdventureOrder,
  getAllAdventureOrdersAdmin,
  updateAdventureOrderStatus,
  deleteAdventureOrder,
} from '../controllers/adventureOrdersController.js';
import { requireAdminAuth } from '../middlewares/auth.js';

const router = Router();

// ==========================================
// Rutas Públicas (Armá tu Aventura)
// ==========================================
router.post('/', submitAdventureOrder);

// ==========================================
// Rutas Protegidas (Backoffice / Admin)
// ==========================================
router.get('/admin/all', requireAdminAuth, getAllAdventureOrdersAdmin);
router.patch('/admin/:id/status', requireAdminAuth, updateAdventureOrderStatus);
router.delete('/admin/:id', requireAdminAuth, deleteAdventureOrder);

export default router;
