import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

console.log(' Probando conexión a Supabase PostgreSQL (Transaction Pooler)...');
console.log(` Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(` Base de datos: ${dbConfig.database}`);
console.log(` Usuario: ${dbConfig.user}`);

if (!dbConfig.password) {
  console.error('\n❌ Error: DB_PASSWORD no está definida en backend/.env');
  console.log('👉 Por favor define DB_PASSWORD=<tu_contraseña> en tu archivo backend/.env antes de probar.');
  process.exit(1);
}

const pool = new Pool(dbConfig);

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() as now, version() as version;');
    console.log('\n✅ ¡CONEXIÓN EXITOSA CON SUPABASE POSTGRESQL!');
    console.log(`⏰ Hora del servidor DB: ${res.rows[0].now}`);
    console.log(`📦 Versión: ${res.rows[0].version.slice(0, 50)}...\n`);

    // Comprobar si existen las tablas
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('📋 Tablas detectadas en la base de datos:');
    if (tablesRes.rows.length === 0) {
      console.log('   (Ninguna tabla aún. Recuerda ejecutar 01_schema.sql en el SQL Editor de Supabase)');
    } else {
      tablesRes.rows.forEach((r) => console.log(`   - ${r.table_name}`));
    }

    await pool.end();
  } catch (err) {
    console.error('\n❌ Error de conexión:', err.message);
    if (err.message.includes('password authentication failed')) {
      console.error('👉 La contraseña provista en DB_PASSWORD no es correcta.');
    }
    process.exit(1);
  }
}

testConnection();
