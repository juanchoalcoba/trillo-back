import cloudinary from '../config/cloudinary.js';

/**
 * Genera una firma criptográfica para subidas directas desde el Backoffice a Cloudinary.
 * Ruta protegida: requiere sesión activa de administrador.
 */
export async function getUploadSignature(req, res, next) {
  try {
    const { folder = 'trillo/general' } = req.body;

    // Validación de seguridad de carpeta: solo dentro del espacio trillo/
    const targetFolder = String(folder).trim();
    if (!targetFolder.startsWith('trillo')) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'La carpeta de destino debe pertenecer al espacio "trillo/".',
          code: 'INVALID_FOLDER',
        },
      });
    }

    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign = {
      folder: targetFolder,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success: true,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY || '294358133435788',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'pglfifpm',
      folder: targetFolder,
    });
  } catch (err) {
    next(err);
  }
}

export default { getUploadSignature };
