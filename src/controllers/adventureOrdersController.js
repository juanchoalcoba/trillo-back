import { query } from '../config/db.js';

// ==========================================
// CONTROLADOR PÚBLICO (Envío de Pedidos)
// ==========================================

export async function submitAdventureOrder(req, res, next) {
  try {
    const {
      name,
      phone,
      email,
      destination,
      people_count,
      duration_days,
      activity_type,
      estimated_date,
      notes,
    } = req.body;

    // Validación de campos obligatorios
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: { message: 'Por favor indicá tu nombre y apellido.', code: 'NAME_REQUIRED' },
      });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'Por favor indicá un número de WhatsApp o teléfono válido.', code: 'PHONE_REQUIRED' },
      });
    }

    const validDestinations = ['durazno', 'interior_uruguay', 'internacional'];
    if (!destination || !validDestinations.includes(destination)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Por favor seleccioná un destino válido (Durazno, Interior de Uruguay o Internacional).', code: 'DESTINATION_REQUIRED' },
      });
    }

    const cleanPeopleCount = parseInt(people_count, 10) > 0 ? parseInt(people_count, 10) : 1;
    const cleanDurationDays = duration_days && String(duration_days).trim().length > 0
      ? String(duration_days).trim()
      : '1 día';

    // Sanitización
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email && typeof email === 'string' && email.trim().length > 0 ? email.trim() : null;
    const cleanActivity = activity_type && typeof activity_type === 'string' && activity_type.trim().length > 0
      ? activity_type.trim()
      : null;
    const cleanEstimatedDate = estimated_date && typeof estimated_date === 'string' && estimated_date.trim().length > 0
      ? estimated_date.trim()
      : null;
    const cleanNotes = notes && typeof notes === 'string' && notes.trim().length > 0 ? notes.trim() : null;

    const sql = `
      INSERT INTO adventure_orders (
        name, phone, email, destination, people_count, duration_days, activity_type, estimated_date, notes, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
      RETURNING id, name, phone, email, destination, people_count, duration_days, activity_type, estimated_date, notes, status, created_at
    `;

    const result = await query(sql, [
      cleanName,
      cleanPhone,
      cleanEmail,
      destination,
      cleanPeopleCount,
      cleanDurationDays,
      cleanActivity,
      cleanEstimatedDate,
      cleanNotes,
    ]);

    const saved = result.rows[0];

    res.status(201).json({
      success: true,
      message: '¡Excelente! Recibimos tu solicitud para armar tu aventura. Nos comunicaremos contigo para coordinar todos los detalles.',
      data: saved,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// CONTROLADOR PRIVADO (Backoffice / Admin)
// ==========================================

export async function getAllAdventureOrdersAdmin(req, res, next) {
  try {
    const sql = `
      SELECT id, name, phone, email, destination, people_count, duration_days,
             activity_type, estimated_date, notes, status, admin_notes, created_at, updated_at
      FROM adventure_orders
      ORDER BY created_at DESC
    `;
    const result = await query(sql);

    // Contadores por estado
    const pendingCount = result.rows.filter((o) => o.status === 'pending').length;
    const contactedCount = result.rows.filter((o) => o.status === 'contacted').length;
    const confirmedCount = result.rows.filter((o) => o.status === 'confirmed').length;

    res.json({
      success: true,
      count: result.rows.length,
      pendingCount,
      contactedCount,
      confirmedCount,
      orders: result.rows,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAdventureOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const allowedStatuses = ['pending', 'contacted', 'confirmed', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Estado inválido. Debe ser pending, contacted, confirmed o cancelled.', code: 'INVALID_STATUS' },
      });
    }

    let sql = `
      UPDATE adventure_orders
      SET updated_at = NOW()
    `;
    const params = [];
    let paramIndex = 1;

    if (status !== undefined) {
      sql += `, status = $${paramIndex++}`;
      params.push(status);
    }

    if (admin_notes !== undefined) {
      sql += `, admin_notes = $${paramIndex++}`;
      params.push(admin_notes);
    }

    sql += ` WHERE id = $${paramIndex} RETURNING *`;
    params.push(id);

    const result = await query(sql, params);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Pedido no encontrado.', code: 'ORDER_NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: 'Estado del pedido actualizado correctamente.',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdventureOrder(req, res, next) {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM adventure_orders WHERE id = $1 RETURNING id`;
    const result = await query(sql, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Pedido no encontrado.', code: 'ORDER_NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: 'Pedido eliminado correctamente.',
      data: { id: result.rows[0].id },
    });
  } catch (err) {
    next(err);
  }
}
