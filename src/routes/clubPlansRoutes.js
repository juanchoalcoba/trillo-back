import { Router } from 'express';
import {
  getPublishedClubPlans,
  getClubPlanBySlugOrId,
  getAllClubPlansAdmin,
  updateClubPlan,
} from '../controllers/clubPlansController.js';
import { requireAdminAuth } from '../middlewares/auth.js';

const router = Router();

// ==========================================
// Rutas Públicas (Web Pública)
// ==========================================
router.get('/', getPublishedClubPlans);
router.get('/:slugOrId', getClubPlanBySlugOrId);

// ==========================================
// Rutas Protegidas (Backoffice / Admin)
// ==========================================
router.get('/admin/all', requireAdminAuth, getAllClubPlansAdmin);
router.put('/admin/:id', requireAdminAuth, updateClubPlan);

export default router;
