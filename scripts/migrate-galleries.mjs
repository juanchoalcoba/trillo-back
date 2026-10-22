import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');

// Cargar .env desde backend/
dotenv.config({ path: path.join(backendDir, '.env') });

const { Pool } = pg;

const dbConfig = {
  host: process.env.DB_HOST || 'aws-0-us-west-2.pooler.supabase.com',
  port: Number(process.env.DB_PORT) || 6543,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres.tjacgejuvnmbtmpnepfx',
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
};

if (!dbConfig.password) {
  console.error('\n❌ Error: DB_PASSWORD no está definida en backend/.env');
  process.exit(1);
}

const pool = new Pool(dbConfig);

async function migrateGalleries() {
  console.log('🚀 Iniciando migración de galerías a PostgreSQL Supabase...');

  try {
    // 1. Ejecutar DDL para crear la tabla si no existe
    const ddlPath = path.join(backendDir, 'database', '06_gallery_items.sql');
    const ddlSql = fs.readFileSync(ddlPath, 'utf-8');
    await pool.query(ddlSql);
    console.log('✅ Tabla gallery_items verificada / creada correctamente.');

    // 2. Comprobar si ya existen registros
    const countRes = await pool.query('SELECT COUNT(*)::int as count FROM gallery_items;');
    const existingCount = countRes.rows[0].count;
    console.log(`📊 Registros actuales en gallery_items: ${existingCount}`);

    if (existingCount > 0) {
      console.log('ℹ️ Ya existen fotos en la base de datos. Se omitirá el seed automático.');
      process.exit(0);
    }

    // 3. Importar dinámicamente las fotos estáticas de galeriasData.js
    const galeriasDataPath = path.resolve(backendDir, '..', 'frontend', 'src', 'data', 'galeriasData.js');
    const { AVENTURAS_GALLERY, EVENTOS_GALLERIES } = await import(`file://${galeriasDataPath.replace(/\\/g, '/')}`);

    console.log('\n📥 Sembrando fotos iniciales desde galeriasData.js...');

    let insertedCount = 0;

    // Helper para insertar
    const insertItem = async (category, section, item, orderIndex) => {
      const query = `
        INSERT INTO gallery_items (category, section, title, image_url, thumbnail_url, public_id, order_index, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      `;
      await pool.query(query, [
        category,
        section,
        item.title || null,
        item.full || item.url,
        item.thumbnail || item.url,
        item.publicId || null,
        orderIndex,
      ]);
      insertedCount++;
    };

    // A) Insertar Aventuras
    if (Array.isArray(AVENTURAS_GALLERY)) {
      for (let i = 0; i < AVENTURAS_GALLERY.length; i++) {
        await insertItem('aventuras', 'general', AVENTURAS_GALLERY[i], i);
      }
      console.log(`  🌲 Aventuras: ${AVENTURAS_GALLERY.length} fotos sembradas.`);
    }

    // B) Insertar Eventos (rebollo, laberinto, sanpedro)
    if (EVENTOS_GALLERIES) {
      for (const [sectionKey, items] of Object.entries(EVENTOS_GALLERIES)) {
        if (Array.isArray(items)) {
          for (let i = 0; i < items.length; i++) {
            await insertItem('eventos', sectionKey, items[i], i);
          }
          console.log(`  🏃 Eventos (${sectionKey}): ${items.length} fotos sembradas.`);
        }
      }
    }

    console.log(`\n🎉 ¡MIGRACIÓN COMPLETADA! Total fotos insertadas: ${insertedCount}`);
  } catch (err) {
    console.error('\n❌ Error durante la migración de galerías:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateGalleries();
