import { Router } from 'express';
import { getUploadSignature } from '../controllers/uploadController.js';
import { requireAdminAuth } from '../middlewares/auth.js';

const router = Router();

// Endpoint protegido para obtener la firma de subida
router.post('/signature', requireAdminAuth, getUploadSignature);

export default router;
