import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');

// Cargar .env de backend
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

// Argumentos desde la línea de comandos
const args = process.argv.slice(2);
const email = (args[0] || 'admin@trilloeventos.com').trim().toLowerCase();
const password = args[1] || 'Trillo2026!Admin';
const name = args[2] || 'Administrador Trillo';

if (!password || password.length < 8) {
  console.error('❌ Error: La contraseña debe tener al menos 8 caracteres.');
  process.exit(1);
}

const pool = new Pool(dbConfig);

async function createAdmin() {
  console.log('🔐 Generando hash seguro con bcrypt (costo 12)...');
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  console.log(`👤 Registrando/actualizando administrador: ${email} (${name})...`);

  const query = `
    INSERT INTO admin_users (email, password_hash, name, role, is_active)
    VALUES ($1, $2, $3, 'admin', true)
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      name = EXCLUDED.name,
      is_active = true,
      updated_at = NOW()
    RETURNING id, email, name, role, is_active, created_at, updated_at;
  `;

  try {
    const res = await pool.query(query, [email, passwordHash, name]);
    const user = res.rows[0];

    console.log('\n✅ ¡USUARIO ADMINISTRADOR CREADO / ACTUALIZADO CON ÉXITO!');
    console.log('--------------------------------------------------');
    console.log(`🆔 ID:       ${user.id}`);
    console.log(`📧 Email:    ${user.email}`);
    console.log(`👤 Nombre:   ${user.name}`);
    console.log(`🛡️ Rol:      ${user.role}`);
    console.log(`🔑 Clave:    ${password} (almacenada como hash bcrypt)`);
    console.log('--------------------------------------------------');
    console.log('👉 Puedes cambiar la contraseña cuando quieras ejecutando:');
    console.log('   node scripts/create-admin.mjs <email> <nueva_contraseña> [nombre]');
    console.log('--------------------------------------------------\n');

    await pool.end();
  } catch (err) {
    console.error('❌ Error al guardar en PostgreSQL:', err.message);
    process.exit(1);
  }
}

createAdmin();
