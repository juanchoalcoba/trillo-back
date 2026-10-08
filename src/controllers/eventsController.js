import { query } from '../config/db.js';

// ==========================================
// CONTROLADOR PÚBLICO (Lectura de Eventos)
// ==========================================

export async function getPublishedEvents(req, res, next) {
  try {
    const result = await query(
      `SELECT id, slug, title, subtitle, badge, season, date_text, location,
              elevation, difficulty, terrain, image_url, accent_color,
              short_description, description, distances, highlights,
              kit_includes, schedule, whatsapp_msg, status, order_index
       FROM events
       WHERE status = 'published'
       ORDER BY order_index ASC, created_at DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      events: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function getEventBySlugOrId(req, res, next) {
  try {
    const { slugOrId } = req.params;

    // Detectar si el parámetro tiene formato UUID v4
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    const sql = isUuid
      ? `SELECT * FROM events WHERE id = $1 AND status = 'published'`
      : `SELECT * FROM events WHERE slug = $1 AND status = 'published'`;

    const result = await query(sql, [slugOrId]);
    const event = result.rows[0];

    if (!event) {
      return res.status(404).json({
        success: false,
        error: { message: 'Evento no encontrado o no publicado.', code: 'EVENT_NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// CONTROLADOR PRIVADO (Backoffice / Admin)
// ==========================================

export async function getAllEventsAdmin(req, res, next) {
  try {
    const result = await query(
      `SELECT * FROM events ORDER BY order_index ASC, created_at DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      events: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req, res, next) {
  try {
    const {
      slug, title, subtitle, badge, season, date_text, location,
      elevation, difficulty, terrain, image_url, accent_color,
      short_description, description, distances, highlights,
      kit_includes, schedule, whatsapp_msg, status, order_index,
    } = req.body;

    if (!title || !slug || !image_url) {
      return res.status(400).json({
        success: false,
        error: { message: 'El título, slug e imagen son campos requeridos.', code: 'MISSING_FIELDS' },
      });
    }

    const cleanSlug = String(slug).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');

    const sql = `
      INSERT INTO events (
        slug, title, subtitle, badge, season, date_text, location,
        elevation, difficulty, terrain, image_url, accent_color,
        short_description, description, distances, highlights,
        kit_includes, schedule, whatsapp_msg, status, order_index
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19, $20, $21
      )
      RETURNING *;
    `;

    const params = [
      cleanSlug,
      title,
      subtitle || '',
      badge || 'Oficial',
      season || '',
      date_text || '',
      location || '',
      elevation || '',
      difficulty || 'Media',
      terrain || '',
      image_url,
      accent_color || '#f97316',
      short_description || '',
      description || '',
      JSON.stringify(distances || []),
      JSON.stringify(highlights || []),
      JSON.stringify(kit_includes || []),
      JSON.stringify(schedule || []),
      whatsapp_msg || 'Hola Trillo! Quiero información sobre el evento.',
      status || 'published',
      Number(order_index) || 0,
    ];

    const result = await query(sql, params);

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente.',
      event: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        error: { message: 'Ya existe un evento con este slug identificador.', code: 'SLUG_DUPLICATE' },
      });
    }
    next(err);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const {
      slug, title, subtitle, badge, season, date_text, location,
      elevation, difficulty, terrain, image_url, accent_color,
      short_description, description, distances, highlights,
      kit_includes, schedule, whatsapp_msg, status, order_index,
    } = req.body;

    const sql = `
      UPDATE events SET
        slug = COALESCE($1, slug),
        title = COALESCE($2, title),
        subtitle = COALESCE($3, subtitle),
        badge = COALESCE($4, badge),
        season = COALESCE($5, season),
        date_text = COALESCE($6, date_text),
        location = COALESCE($7, location),
        elevation = COALESCE($8, elevation),
        difficulty = COALESCE($9, difficulty),
        terrain = COALESCE($10, terrain),
        image_url = COALESCE($11, image_url),
        accent_color = COALESCE($12, accent_color),
        short_description = COALESCE($13, short_description),
        description = COALESCE($14, description),
        distances = COALESCE($15, distances),
        highlights = COALESCE($16, highlights),
        kit_includes = COALESCE($17, kit_includes),
        schedule = COALESCE($18, schedule),
        whatsapp_msg = COALESCE($19, whatsapp_msg),
        status = COALESCE($20, status),
        order_index = COALESCE($21, order_index)
      WHERE id = $22
      RETURNING *;
    `;

    const params = [
      slug ? String(slug).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') : null,
      title,
      subtitle,
      badge,
      season,
      date_text,
      location,
      elevation,
      difficulty,
      terrain,
      image_url,
      accent_color,
      short_description,
      description,
      distances ? JSON.stringify(distances) : null,
      highlights ? JSON.stringify(highlights) : null,
      kit_includes ? JSON.stringify(kit_includes) : null,
      schedule ? JSON.stringify(schedule) : null,
      whatsapp_msg,
      status,
      order_index !== undefined ? Number(order_index) : null,
      id,
    ];

    const result = await query(sql, params);
    const event = result.rows[0];

    if (!event) {
      return res.status(404).json({
        success: false,
        error: { message: 'Evento no encontrado.', code: 'NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: 'Evento actualizado correctamente.',
      event,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        error: { message: 'Ya existe otro evento con este slug.', code: 'SLUG_DUPLICATE' },
      });
    }
    next(err);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM events WHERE id = $1 RETURNING id, title`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Evento no encontrado.', code: 'NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: `Evento "${result.rows[0].title}" eliminado con éxito.`,
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleEventStatus(req, res, next) {
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
      `UPDATE events SET status = $1 WHERE id = $2 RETURNING id, title, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Evento no encontrado.', code: 'NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: `Estado actualizado a "${status}".`,
      event: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getPublishedEvents,
  getEventBySlugOrId,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
};
