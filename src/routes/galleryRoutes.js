import { Router } from 'express';
import {
  getPublicGalleries,
  getAllAdminGalleries,
  createGalleryItem,
  updateGalleryItem,
  toggleGalleryItemStatus,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { requireAdminAuth } from '../middlewares/auth.js';

const router = Router();

// ==========================================
// 1. RUTA PÚBLICA (Web pública)
// ==========================================
router.get('/public', getPublicGalleries);

// ==========================================
// 2. RUTAS PROTEGIDAS (Backoffice / Admin)
// ==========================================
router.get('/admin/all', requireAdminAuth, getAllAdminGalleries);
router.post('/admin', requireAdminAuth, createGalleryItem);
router.put('/admin/:id', requireAdminAuth, updateGalleryItem);
router.patch('/admin/:id/status', requireAdminAuth, toggleGalleryItemStatus);
router.delete('/admin/:id', requireAdminAuth, deleteGalleryItem);

export default router;
