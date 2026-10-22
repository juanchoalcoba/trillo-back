import { query } from '../config/db.js';

// ==========================================
// 1. CONTROLADOR PÚBLICO
// ==========================================

/**
 * Obtiene todas las fotos activas organizadas por categoría y sección para el sitio público.
 * GET /api/galleries/public
 */
export async function getPublicGalleries(req, res, next) {
  try {
    const sql = `
      SELECT id, category, section, title, image_url as url, 
             COALESCE(thumbnail_url, image_url) as thumbnail, 
             image_url as full, public_id as "publicId", order_index
      FROM gallery_items
      WHERE is_active = true
      ORDER BY order_index ASC, created_at ASC;
    `;
    const result = await query(sql);

    // Organizar respuesta en el formato exacto que consumen EventosGallery y AventurasGallery
    const response = {
      aventuras: [],
      eventos: {
        rebollo: [],
        laberinto: [],
        sanpedro: [],
      },
    };

    result.rows.forEach((item) => {
      if (item.category === 'aventuras') {
        response.aventuras.push(item);
      } else if (item.category === 'eventos') {
        const sec = item.section.toLowerCase();
        if (!response.eventos[sec]) {
          response.eventos[sec] = [];
        }
        response.eventos[sec].push(item);
      }
    });

    return res.json({
      success: true,
      galleries: response,
      totalCount: result.rows.length,
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// 2. CONTROLADORES PRIVADOS (Backoffice / Admin)
// ==========================================

/**
 * Obtiene todas las fotos para el panel de administración, con filtros opcionales.
 * GET /api/galleries/admin/all
 */
export async function getAllAdminGalleries(req, res, next) {
  try {
    const { category, section, status } = req.query;

    let sql = `
      SELECT id, category, section, title, image_url, thumbnail_url, public_id,
             order_index, is_active, created_at, updated_at
      FROM gallery_items
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (section) {
      params.push(section);
      sql += ` AND section = $${params.length}`;
    }

    if (status === 'active') {
      sql += ` AND is_active = true`;
    } else if (status === 'inactive') {
      sql += ` AND is_active = false`;
    }

    sql += ` ORDER BY order_index ASC, created_at DESC;`;

    const result = await query(sql, params);

    return res.json({
      success: true,
      items: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Registra una nueva foto en la galería.
 * POST /api/galleries/admin
 */
export async function createGalleryItem(req, res, next) {
  try {
    const {
      category,
      section,
      title,
      image_url,
      thumbnail_url,
      public_id,
      order_index,
      is_active,
    } = req.body;

    if (!category || !section || !image_url) {
      return res.status(400).json({
        success: false,
        error: 'Los campos category, section e image_url son requeridos.',
      });
    }

    // Auto-generar thumbnail optimizado en Cloudinary si no viene provisto
    let calculatedThumb = thumbnail_url || image_url;
    if (image_url.includes('cloudinary.com') && !thumbnail_url) {
      calculatedThumb = image_url.replace('/upload/', '/upload/f_auto,q_auto,w_800,c_limit/');
    }

    // Calcular el siguiente order_index si no fue especificado
    let nextOrder = order_index;
    if (nextOrder === undefined || nextOrder === null) {
      const maxOrderRes = await query(
        `SELECT COALESCE(MAX(order_index), -1) + 1 as next_order FROM gallery_items WHERE category = $1 AND section = $2`,
        [category, section]
      );
      nextOrder = maxOrderRes.rows[0].next_order;
    }

    const sql = `
      INSERT INTO gallery_items (
        category, section, title, image_url, thumbnail_url, public_id, order_index, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const result = await query(sql, [
      category,
      section,
      title || null,
      image_url,
      calculatedThumb,
      public_id || null,
      nextOrder,
      is_active !== undefined ? is_active : true,
    ]);

    return res.status(201).json({
      success: true,
      item: result.rows[0],
      message: 'Fotografía agregada a la galería con éxito.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Actualiza los datos de una foto (título, orden, sección o estado).
 * PUT /api/galleries/admin/:id
 */
export async function updateGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    const { title, order_index, category, section, is_active } = req.body;

    const sql = `
      UPDATE gallery_items
      SET 
        title = COALESCE($1, title),
        order_index = COALESCE($2, order_index),
        category = COALESCE($3, category),
        section = COALESCE($4, section),
        is_active = COALESCE($5, is_active),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `;

    const result = await query(sql, [
      title !== undefined ? title : null,
      order_index !== undefined ? order_index : null,
      category || null,
      section || null,
      is_active !== undefined ? is_active : null,
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'La fotografía solicitada no existe.',
      });
    }

    return res.json({
      success: true,
      item: result.rows[0],
      message: 'Fotografía actualizada correctamente.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Activa o desactiva la visibilidad de una foto en la web pública.
 * PATCH /api/galleries/admin/:id/status
 */
export async function toggleGalleryItemStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const sql = `
      UPDATE gallery_items
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, category, section, title, is_active;
    `;

    const result = await query(sql, [is_active, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'La fotografía solicitada no existe.',
      });
    }

    return res.json({
      success: true,
      item: result.rows[0],
      message: `Fotografía ${is_active ? 'activada' : 'ocultada'} con éxito.`,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Elimina una foto de la galería.
 * DELETE /api/galleries/admin/:id
 */
export async function deleteGalleryItem(req, res, next) {
  try {
    const { id } = req.params;

    const sql = `DELETE FROM gallery_items WHERE id = $1 RETURNING id, public_id;`;
    const result = await query(sql, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'La fotografía no existe o ya fue eliminada.',
      });
    }

    return res.json({
      success: true,
      deletedId: id,
      publicId: result.rows[0].public_id,
      message: 'Fotografía eliminada de la galería.',
    });
  } catch (error) {
    next(error);
  }
}
