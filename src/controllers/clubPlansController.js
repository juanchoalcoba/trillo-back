import { query } from '../config/db.js';

// ==========================================
// CONTROLADOR PÚBLICO (Lectura de Planes)
// ==========================================

export async function getPublishedClubPlans(req, res, next) {
  try {
    const result = await query(
      `SELECT id, slug, name, badge, price, period, tagline,
              highlighted, accent_color, features, whatsapp_msg,
              status, order_index
       FROM club_plans
       WHERE status = 'published'
       ORDER BY order_index ASC, created_at ASC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      plans: result.rows,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function getClubPlanBySlugOrId(req, res, next) {
  try {
    const { slugOrId } = req.params;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    const sql = isUuid
      ? `SELECT * FROM club_plans WHERE id = $1`
      : `SELECT * FROM club_plans WHERE slug = $1`;

    const result = await query(sql, [slugOrId]);
    const plan = result.rows[0];

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: { message: 'Plan no encontrado.', code: 'PLAN_NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      plan,
      data: plan,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// CONTROLADOR PRIVADO (Backoffice / Admin)
// ==========================================

export async function getAllClubPlansAdmin(req, res, next) {
  try {
    const result = await query(
      `SELECT * FROM club_plans
       ORDER BY order_index ASC, created_at ASC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      plans: result.rows,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateClubPlan(req, res, next) {
  try {
    const { id } = req.params;
    const {
      name,
      badge,
      price,
      period,
      tagline,
      highlighted,
      accent_color,
      features,
      whatsapp_msg,
      status,
      order_index,
    } = req.body;

    // Validación básica de campos requeridos
    if (!name || !price || !period) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Los campos nombre, precio y período son obligatorios.',
          code: 'VALIDATION_ERROR',
        },
      });
    }

    // Normalizar features a JSON válido
    let featuresJson;
    if (Array.isArray(features)) {
      featuresJson = JSON.stringify(features.filter((f) => typeof f === 'string' && f.trim() !== ''));
    } else if (typeof features === 'string') {
      try {
        featuresJson = JSON.stringify(JSON.parse(features));
      } catch {
        featuresJson = JSON.stringify([]);
      }
    } else {
      featuresJson = JSON.stringify([]);
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const sql = isUuid
      ? `UPDATE club_plans
         SET name = $1,
             badge = $2,
             price = $3,
             period = $4,
             tagline = $5,
             highlighted = $6,
             accent_color = $7,
             features = $8::jsonb,
             whatsapp_msg = $9,
             status = $10,
             order_index = $11
         WHERE id = $12
         RETURNING *`
      : `UPDATE club_plans
         SET name = $1,
             badge = $2,
             price = $3,
             period = $4,
             tagline = $5,
             highlighted = $6,
             accent_color = $7,
             features = $8::jsonb,
             whatsapp_msg = $9,
             status = $10,
             order_index = $11
         WHERE slug = $12
         RETURNING *`;

    const values = [
      name.trim(),
      badge ? badge.trim() : null,
      price.trim(),
      period.trim(),
      tagline ? tagline.trim() : '',
      Boolean(highlighted),
      accent_color ? accent_color.trim() : '#f59e0b',
      featuresJson,
      whatsapp_msg ? whatsapp_msg.trim() : '',
      status === 'draft' ? 'draft' : 'published',
      Number.isInteger(Number(order_index)) ? Number(order_index) : 0,
      id,
    ];

    const result = await query(sql, values);
    const updatedPlan = result.rows[0];

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        error: { message: 'Plan no encontrado para actualizar.', code: 'PLAN_NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: 'Plan del Club actualizado correctamente.',
      plan: updatedPlan,
      data: updatedPlan,
    });
  } catch (err) {
    next(err);
  }
}
