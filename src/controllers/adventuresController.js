import { query } from '../config/db.js';

// ==========================================
// CONTROLADOR PÚBLICO (Lectura de Aventuras)
// ==========================================

export async function getPublishedAdventures(req, res, next) {
  try {
    const { category } = req.query;

    let sql = `
      SELECT id, slug, category, title, subtitle, badge, location,
             duration, difficulty, distance, elevation, group_size,
             image_url, description, highlights, itinerary, included,
             requirements, whatsapp_msg, status, order_index
      FROM adventures
      WHERE status = 'published'
    `;
    const params = [];

    if (category) {
      sql += ` AND category = $1`;
      params.push(String(category).trim().toLowerCase());
    }

    sql += ` ORDER BY order_index ASC, created_at DESC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      category: category || 'all',
      adventures: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdventureBySlugOrId(req, res, next) {
  try {
    const { slugOrId } = req.params;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    const sql = isUuid
      ? `SELECT * FROM adventures WHERE id = $1 AND status = 'published'`
      : `SELECT * FROM adventures WHERE slug = $1 AND status = 'published'`;

    const result = await query(sql, [slugOrId]);
    const adventure = result.rows[0];

    if (!adventure) {
      return res.status(404).json({
        success: false,
        error: { message: 'Aventura no encontrada o no publicada.', code: 'ADVENTURE_NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      adventure,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// CONTROLADOR PRIVADO (Backoffice / Admin)
// ==========================================

export async function getAllAdventuresAdmin(req, res, next) {
  try {
    const result = await query(
      `SELECT * FROM adventures ORDER BY order_index ASC, created_at DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      adventures: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function createAdventure(req, res, next) {
  try {
    const {
      slug, category, title, subtitle, badge, location,
      duration, difficulty, distance, elevation, group_size,
      image_url, description, highlights, itinerary, included,
      requirements, whatsapp_msg, status, order_index,
    } = req.body;

    if (!title || !slug || !image_url || !category) {
      return res.status(400).json({
        success: false,
        error: { message: 'El título, slug, categoría e imagen son campos obligatorios.', code: 'MISSING_FIELDS' },
      });
    }

    const cleanSlug = String(slug).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    const validCategory = String(category).trim().toLowerCase();

    const sql = `
      INSERT INTO adventures (
        slug, category, title, subtitle, badge, location,
        duration, difficulty, distance, elevation, group_size,
        image_url, description, highlights, itinerary, included,
        requirements, whatsapp_msg, status, order_index
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16,
        $17, $18, $19, $20
      )
      RETURNING *;
    `;

    const params = [
      cleanSlug,
      validCategory,
      title,
      subtitle || '',
      badge || 'Aventura',
      location || '',
      duration || '',
      difficulty || 'Media',
      distance || '',
      elevation || '',
      group_size || '',
      image_url,
      description || '',
      JSON.stringify(highlights || []),
      JSON.stringify(itinerary || []),
      JSON.stringify(included || []),
      JSON.stringify(requirements || []),
      whatsapp_msg || 'Hola Trillo! Quisiera más información sobre la aventura.',
      status || 'published',
      Number(order_index) || 0,
    ];

    const result = await query(sql, params);

    res.status(201).json({
      success: true,
      message: 'Aventura creada exitosamente.',
      adventure: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        error: { message: 'Ya existe una aventura con este slug identificador.', code: 'SLUG_DUPLICATE' },
      });
    }
    next(err);
  }
}

export async function updateAdventure(req, res, next) {
  try {
    const { id } = req.params;
    const {
      slug, category, title, subtitle, badge, location,
      duration, difficulty, distance, elevation, group_size,
      image_url, description, highlights, itinerary, included,
      requirements, whatsapp_msg, status, order_index,
    } = req.body;

    const sql = `
      UPDATE adventures SET
        slug = COALESCE($1, slug),
        category = COALESCE($2, category),
        title = COALESCE($3, title),
        subtitle = COALESCE($4, subtitle),
        badge = COALESCE($5, badge),
        location = COALESCE($6, location),
        duration = COALESCE($7, duration),
        difficulty = COALESCE($8, difficulty),
        distance = COALESCE($9, distance),
        elevation = COALESCE($10, elevation),
        group_size = COALESCE($11, group_size),
        image_url = COALESCE($12, image_url),
        description = COALESCE($13, description),
        highlights = COALESCE($14, highlights),
        itinerary = COALESCE($15, itinerary),
        included = COALESCE($16, included),
        requirements = COALESCE($17, requirements),
        whatsapp_msg = COALESCE($18, whatsapp_msg),
        status = COALESCE($19, status),
        order_index = COALESCE($20, order_index)
      WHERE id = $21
      RETURNING *;
    `;

    const params = [
      slug ? String(slug).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') : null,
      category ? String(category).trim().toLowerCase() : null,
      title,
      subtitle,
      badge,
      location,
      duration,
      difficulty,
      distance,
      elevation,
      group_size,
      image_url,
      description,
      highlights ? JSON.stringify(highlights) : null,
      itinerary ? JSON.stringify(itinerary) : null,
      included ? JSON.stringify(included) : null,
      requirements ? JSON.stringify(requirements) : null,
      whatsapp_msg,
      status,
      order_index !== undefined ? Number(order_index) : null,
      id,
    ];

    const result = await query(sql, params);
    const adventure = result.rows[0];

    if (!adventure) {
      return res.status(404).json({
        success: false,
        error: { message: 'Aventura no encontrada.', code: 'NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: 'Aventura actualizada correctamente.',
      adventure,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        error: { message: 'Ya existe otra aventura con este slug.', code: 'SLUG_DUPLICATE' },
      });
    }
    next(err);
  }
}

export async function deleteAdventure(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM adventures WHERE id = $1 RETURNING id, title`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Aventura no encontrada.', code: 'NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: `Aventura "${result.rows[0].title}" eliminada con éxito.`,
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleAdventureStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['published', 'draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: "El estado debe ser 'published' o 'draft'.", code: 'INVALID_STATUS' },
      });
    }

    const result = await query(
      `UPDATE adventures SET status = $1 WHERE id = $2 RETURNING id, title, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Aventura no encontrada.', code: 'NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: `Estado actualizado a "${status}".`,
      adventure: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getPublishedAdventures,
  getAdventureBySlugOrId,
  getAllAdventuresAdmin,
  createAdventure,
  updateAdventure,
  deleteAdventure,
  toggleAdventureStatus,
};
