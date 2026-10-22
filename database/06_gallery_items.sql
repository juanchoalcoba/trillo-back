-- =======================================================
-- TRILLO EVENTOS - DDL TABLA: gallery_items
-- Motor: Supabase PostgreSQL (Transaction Pooler - Port 6543)
-- =======================================================

CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(30) NOT NULL,    -- 'eventos' | 'aventuras'
  section VARCHAR(50) NOT NULL,     -- 'rebollo' | 'laberinto' | 'sanpedro' | 'general'
  title VARCHAR(150) NULL,          -- Pie de foto o título descriptivo
  image_url TEXT NOT NULL,          -- URL en Cloudinary (alta resolución)
  thumbnail_url TEXT NULL,          -- URL miniatura optimizada
  public_id VARCHAR(255) NULL,      -- Public ID en Cloudinary
  order_index INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para consultas ultra rápidas por categoría y sección
CREATE INDEX IF NOT EXISTS idx_gallery_items_lookup 
  ON gallery_items(category, section, is_active, order_index ASC);

-- Trigger para updated_at automático
DROP TRIGGER IF EXISTS trg_gallery_items_updated_at ON gallery_items;
CREATE TRIGGER trg_gallery_items_updated_at
BEFORE UPDATE ON gallery_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
