import { Router } from 'express';
import {
  getPublishedEvents,
  getEventBySlugOrId,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
} from '../controllers/eventsController.js';
import { requireAdminAuth } from '../middlewares/auth.js';

const router = Router();

// ==========================================
// Rutas Públicas (Lectura para la web pública)
// ==========================================
router.get('/', getPublishedEvents);
router.get('/:slugOrId', getEventBySlugOrId);

// ==========================================
// Rutas Protegidas (Backoffice / Admin)
// ==========================================
router.get('/admin/all', requireAdminAuth, getAllEventsAdmin);
router.post('/admin', requireAdminAuth, createEvent);
router.put('/admin/:id', requireAdminAuth, updateEvent);
router.delete('/admin/:id', requireAdminAuth, deleteEvent);
router.patch('/admin/:id/status', requireAdminAuth, toggleEventStatus);

export default router;
