import { Router } from 'express';
import {
  getPublishedProducts,
  getProductBySlugOrId,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from '../controllers/productsController.js';
import { requireAdminAuth } from '../middlewares/auth.js';

const router = Router();

// ==========================================
// Rutas Públicas (Lectura para la web pública)
// ==========================================
router.get('/', getPublishedProducts);
router.get('/:slugOrId', getProductBySlugOrId);

// ==========================================
// Rutas Protegidas (Backoffice / Admin)
// ==========================================
router.get('/admin/all', requireAdminAuth, getAllProductsAdmin);
router.post('/admin', requireAdminAuth, createProduct);
router.put('/admin/:id', requireAdminAuth, updateProduct);
router.delete('/admin/:id', requireAdminAuth, deleteProduct);
router.patch('/admin/:id/status', requireAdminAuth, toggleProductStatus);

export default router;
