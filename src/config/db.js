import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración de conexión compatible con variables individuales o connection string
const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || 'aws-0-us-west-2.pooler.supabase.com',
      port: Number(process.env.DB_PORT) || 6543,
      database: process.env.DB_NAME || 'postgres',
      user: process.env.DB_USER || 'postgres.tjacgejuvnmbtmpnepfx',
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
    };

// Pool optimizado para Transaction Pooler de Supabase y Vercel Serverless
export const pool = new Pool({
  ...dbConfig,
  max: 2, // Límite estricto para evitar saturar el pooler en serverless lambdas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]:', err.message);
});

/**
 * Ejecuta una consulta parametrizada contra PostgreSQL (previene SQL Injection).
 * @param {string} text Consulta SQL con marcadores $1, $2, etc.
 * @param {Array} params Parámetros sanitizados
 */
export async function query(text, params = []) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SQL Query] (${duration}ms):`, text.slice(0, 80));
  }
  return res;
}

export default { pool, query };
