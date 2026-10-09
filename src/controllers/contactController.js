import { query } from '../config/db.js';

// ==========================================
// CONTROLADOR PÚBLICO (Envío de Mensajes)
// ==========================================

export async function submitContactMessage(req, res, next) {
  try {
    const { name, phone, email, subject, message } = req.body;

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
        error: { message: 'Por favor indicá un número de teléfono o celular válido.', code: 'PHONE_REQUIRED' },
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: { message: 'Por favor escribí el mensaje o consulta que deseas realizar.', code: 'MESSAGE_REQUIRED' },
      });
    }

    // Sanitización y normalización
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email && typeof email === 'string' && email.trim().length > 0 ? email.trim() : null;
    const cleanSubject = subject && typeof subject === 'string' && subject.trim().length > 0 ? subject.trim() : 'General';
    const cleanMessage = message.trim();

    const sql = `
      INSERT INTO contact_messages (name, phone, email, subject, message, status)
      VALUES ($1, $2, $3, $4, $5, 'unread')
      RETURNING id, name, phone, email, subject, message, status, created_at
    `;

    const result = await query(sql, [cleanName, cleanPhone, cleanEmail, cleanSubject, cleanMessage]);
    const saved = result.rows[0];

    res.status(201).json({
      success: true,
      message: '¡Gracias por comunicarte! Tu mensaje fue recibido y te responderemos a la brevedad.',
      data: saved,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// CONTROLADOR PRIVADO (Backoffice / Admin)
// ==========================================

export async function getAllContactMessagesAdmin(req, res, next) {
  try {
    const sql = `
      SELECT id, name, phone, email, subject, message, status, admin_notes, created_at, updated_at
      FROM contact_messages
      ORDER BY created_at DESC
    `;
    const result = await query(sql);

    // Contar no leídos
    const unreadCount = result.rows.filter((m) => m.status === 'unread').length;

    res.json({
      success: true,
      count: result.rows.length,
      unreadCount,
      messages: result.rows,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateContactMessageStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const allowedStatuses = ['unread', 'read', 'archived'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Estado inválido. Debe ser unread, read o archived.', code: 'INVALID_STATUS' },
      });
    }

    let sql = `
      UPDATE contact_messages
      SET status = COALESCE($1, status),
          admin_notes = COALESCE($2, admin_notes)
      WHERE id = $3
      RETURNING *
    `;

    const result = await query(sql, [status || null, admin_notes !== undefined ? admin_notes : null, id]);
    const updated = result.rows[0];

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { message: 'Mensaje no encontrado.', code: 'MESSAGE_NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: 'Mensaje actualizado correctamente.',
      messageItem: updated,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteContactMessage(req, res, next) {
  try {
    const { id } = req.params;

    const sql = `DELETE FROM contact_messages WHERE id = $1 RETURNING id`;
    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Mensaje no encontrado para eliminar.', code: 'MESSAGE_NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: 'Mensaje eliminado correctamente.',
      deletedId: id,
    });
  } catch (err) {
    next(err);
  }
}
