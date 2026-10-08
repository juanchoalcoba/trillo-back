import { Router } from 'express';
import {
  getPublishedAdventures,
  getAdventureBySlugOrId,
  getAllAdventuresAdmin,
  createAdventure,
  updateAdventure,
  deleteAdventure,
  toggleAdventureStatus,
} from '../controllers/adventuresController.js';
import { requireAdminAuth } from '../middlewares/auth.js';

const router = Router();

// ==========================================
// Rutas Públicas (Lectura para la web pública)
// ==========================================
router.get('/', getPublishedAdventures);
router.get('/:slugOrId', getAdventureBySlugOrId);

// ==========================================
// Rutas Protegidas (Backoffice / Admin)
// ==========================================
router.get('/admin/all', requireAdminAuth, getAllAdventuresAdmin);
router.post('/admin', requireAdminAuth, createAdventure);
router.put('/admin/:id', requireAdminAuth, updateAdventure);
router.delete('/admin/:id', requireAdminAuth, deleteAdventure);
router.patch('/admin/:id/status', requireAdminAuth, toggleAdventureStatus);

export default router;
