import { query } from '../config/db.js';

// ==========================================
// CONTROLADOR PÚBLICO (Lectura de Productos)
// ==========================================

export async function getPublishedProducts(req, res, next) {
  try {
    const { category } = req.query;

    let sql = `
      SELECT id, slug, category, name, subtitle, price, currency, badge,
             front_image_url, back_image_url, full_mockup_url,
             description, features, sizes, size_guide, stock_status,
             status, order_index
      FROM products
      WHERE status = 'published'
    `;
    const params = [];

    if (category && category !== 'all') {
      sql += ` AND category = $1`;
      params.push(String(category).trim().toLowerCase());
    }

    sql += ` ORDER BY order_index ASC, created_at DESC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      category: category || 'all',
      products: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlugOrId(req, res, next) {
  try {
    const { slugOrId } = req.params;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    const sql = isUuid
      ? `SELECT * FROM products WHERE id = $1 AND status = 'published'`
      : `SELECT * FROM products WHERE slug = $1 AND status = 'published'`;

    const result = await query(sql, [slugOrId]);
    const product = result.rows[0];

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: 'Prenda o producto no encontrado.', code: 'PRODUCT_NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// CONTROLADOR PRIVADO (Backoffice / Admin)
// ==========================================

export async function getAllProductsAdmin(req, res, next) {
  try {
    const result = await query(
      `SELECT * FROM products ORDER BY order_index ASC, created_at DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const {
      slug, category, name, subtitle, price, currency, badge,
      front_image_url, back_image_url, full_mockup_url,
      description, features, sizes, size_guide, stock_status,
      status, order_index,
    } = req.body;

    if (!name || !slug || !price || !front_image_url) {
      return res.status(400).json({
        success: false,
        error: { message: 'El nombre, slug, precio e imagen frontal son obligatorios.', code: 'MISSING_FIELDS' },
      });
    }

    const cleanSlug = String(slug).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    const numericPrice = Number(price);

    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'El precio debe ser un número válido.', code: 'INVALID_PRICE' },
      });
    }

    const sql = `
      INSERT INTO products (
        slug, category, name, subtitle, price, currency, badge,
        front_image_url, back_image_url, full_mockup_url,
        description, features, sizes, size_guide, stock_status,
        status, order_index
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17
      )
      RETURNING *;
    `;

    const params = [
      cleanSlug,
      category || 'streetwear',
      name,
      subtitle || '',
      numericPrice,
      currency || 'UYU',
      badge || null,
      front_image_url,
      back_image_url || null,
      full_mockup_url || null,
      description || '',
      JSON.stringify(features || []),
      JSON.stringify(sizes || ['S', 'M', 'L', 'XL']),
      JSON.stringify(size_guide || []),
      stock_status || 'available',
      status || 'published',
      Number(order_index) || 0,
    ];

    const result = await query(sql, params);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente.',
      product: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        error: { message: 'Ya existe un producto con este slug identificador.', code: 'SLUG_DUPLICATE' },
      });
    }
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const {
      slug, category, name, subtitle, price, currency, badge,
      front_image_url, back_image_url, full_mockup_url,
      description, features, sizes, size_guide, stock_status,
      status, order_index,
    } = req.body;

    const sql = `
      UPDATE products SET
        slug = COALESCE($1, slug),
        category = COALESCE($2, category),
        name = COALESCE($3, name),
        subtitle = COALESCE($4, subtitle),
        price = COALESCE($5, price),
        currency = COALESCE($6, currency),
        badge = COALESCE($7, badge),
        front_image_url = COALESCE($8, front_image_url),
        back_image_url = COALESCE($9, back_image_url),
        full_mockup_url = COALESCE($10, full_mockup_url),
        description = COALESCE($11, description),
        features = COALESCE($12, features),
        sizes = COALESCE($13, sizes),
        size_guide = COALESCE($14, size_guide),
        stock_status = COALESCE($15, stock_status),
        status = COALESCE($16, status),
        order_index = COALESCE($17, order_index)
      WHERE id = $18
      RETURNING *;
    `;

    const params = [
      slug ? String(slug).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') : null,
      category ? String(category).trim().toLowerCase() : null,
      name,
      subtitle,
      price !== undefined ? Number(price) : null,
      currency,
      badge,
      front_image_url,
      back_image_url,
      full_mockup_url,
      description,
      features ? JSON.stringify(features) : null,
      sizes ? JSON.stringify(sizes) : null,
      size_guide ? JSON.stringify(size_guide) : null,
      stock_status,
      status,
      order_index !== undefined ? Number(order_index) : null,
      id,
    ];

    const result = await query(sql, params);
    const product = result.rows[0];

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: 'Producto no encontrado.', code: 'NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: 'Producto actualizado correctamente.',
      product,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        error: { message: 'Ya existe otro producto con este slug.', code: 'SLUG_DUPLICATE' },
      });
    }
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM products WHERE id = $1 RETURNING id, name`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Producto no encontrado.', code: 'NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: `Producto "${result.rows[0].name}" eliminado con éxito.`,
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleProductStatus(req, res, next) {
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
      `UPDATE products SET status = $1 WHERE id = $2 RETURNING id, name, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Producto no encontrado.', code: 'NOT_FOUND' },
      });
    }

    res.json({
      success: true,
      message: `Estado actualizado a "${status}".`,
      product: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getPublishedProducts,
  getProductBySlugOrId,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
};
