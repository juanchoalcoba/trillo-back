-- =======================================================
-- TRILLO EVENTOS - DDL SCHEMA DEFINITIVO PARA POSTGRESQL
-- Motor: Supabase PostgreSQL (Transaction Pooler - Port 6543)
-- =======================================================

-- 1. Habilitar extensión pgcrypto para UUID v4
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Función genérica para actualización automática de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------
-- TABLA: admin_users (Autenticación propia con bcrypt + JWT)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(30) DEFAULT 'admin' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  last_login_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON admin_users;
CREATE TRIGGER trg_admin_users_updated_at
BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------
-- TABLA: events (Carreras y competencias deportivas)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(150) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  badge VARCHAR(60) NOT NULL,
  season VARCHAR(60) NOT NULL,
  date_text VARCHAR(100) NOT NULL,
  location VARCHAR(150) NOT NULL,
  elevation VARCHAR(80) NOT NULL,
  difficulty VARCHAR(60) NOT NULL,
  terrain VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  accent_color VARCHAR(30) DEFAULT '#f97316' NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  distances JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  kit_includes JSONB NOT NULL DEFAULT '[]'::jsonb,
  schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
  whatsapp_msg TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'published' NOT NULL,
  order_index INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status, order_index);

DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------
-- TABLA: adventures (Expediciones y turismo aventura)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS adventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(40) NOT NULL, -- 'durazno', 'nacionales', 'internacionales'
  title VARCHAR(150) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  badge VARCHAR(60) NOT NULL,
  location VARCHAR(150) NOT NULL,
  duration VARCHAR(60) NOT NULL,
  difficulty VARCHAR(60) NOT NULL,
  distance VARCHAR(60) NOT NULL,
  elevation VARCHAR(60) NOT NULL,
  group_size VARCHAR(60) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  included JSONB NOT NULL DEFAULT '[]'::jsonb,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  whatsapp_msg TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'published' NOT NULL,
  order_index INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_adventures_slug ON adventures(slug);
CREATE INDEX IF NOT EXISTS idx_adventures_category ON adventures(category, status, order_index);

DROP TRIGGER IF EXISTS trg_adventures_updated_at ON adventures;
CREATE TRIGGER trg_adventures_updated_at
BEFORE UPDATE ON adventures
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------
-- TABLA: products (Tienda Trillo - Indumentaria oficial)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(40) NOT NULL, -- 'club', 'carreras', 'streetwear', 'abrigo'
  name VARCHAR(150) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'UYU' NOT NULL,
  badge VARCHAR(60) NULL,
  front_image_url TEXT NOT NULL,
  back_image_url TEXT NULL,
  full_mockup_url TEXT NULL,
  description TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  size_guide JSONB NOT NULL DEFAULT '[]'::jsonb,
  stock_status VARCHAR(30) DEFAULT 'available' NOT NULL, -- 'available', 'preorder', 'out_of_stock'
  status VARCHAR(20) DEFAULT 'published' NOT NULL,
  order_index INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category, status, order_index);

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
