-- =======================================================
-- TRILLO - TABLA: adventure_orders (Pedidos "Armá tu Aventura")
-- =======================================================

CREATE TABLE IF NOT EXISTS adventure_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(150) NULL,
  destination VARCHAR(50) NOT NULL, -- 'durazno', 'interior_uruguay', 'internacional'
  people_count INTEGER DEFAULT 1 NOT NULL,
  duration_days VARCHAR(50) NOT NULL, -- '1 día', '2 días (Fin de semana)', '3 a 5 días', 'Más de 5 días', etc.
  activity_type VARCHAR(100) NULL, -- 'Trekking', 'Kayak', 'Trail Running', 'Combinado', etc.
  estimated_date VARCHAR(100) NULL,
  notes TEXT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending', 'contacted', 'confirmed', 'cancelled'
  admin_notes TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_adventure_orders_status ON adventure_orders(status);
CREATE INDEX IF NOT EXISTS idx_adventure_orders_destination ON adventure_orders(destination);
CREATE INDEX IF NOT EXISTS idx_adventure_orders_created_at ON adventure_orders(created_at DESC);

DROP TRIGGER IF EXISTS trg_adventure_orders_updated_at ON adventure_orders;
CREATE TRIGGER trg_adventure_orders_updated_at
BEFORE UPDATE ON adventure_orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
