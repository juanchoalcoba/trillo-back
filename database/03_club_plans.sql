-- =======================================================
-- TRILLO - TABLA: club_plans (Planes y Cuotas de El Club)
-- =======================================================

CREATE TABLE IF NOT EXISTS club_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(60) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  badge VARCHAR(80) NULL,
  price VARCHAR(50) NOT NULL,
  period VARCHAR(100) NOT NULL,
  tagline TEXT NOT NULL,
  highlighted BOOLEAN DEFAULT false NOT NULL,
  accent_color VARCHAR(30) DEFAULT '#f59e0b' NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  whatsapp_msg TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'published' NOT NULL, -- 'published', 'draft'
  order_index INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_club_plans_slug ON club_plans(slug);
CREATE INDEX IF NOT EXISTS idx_club_plans_status ON club_plans(status, order_index);

DROP TRIGGER IF EXISTS trg_club_plans_updated_at ON club_plans;
CREATE TRIGGER trg_club_plans_updated_at
BEFORE UPDATE ON club_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Datos iniciales (Seed)
INSERT INTO club_plans (
  slug, name, badge, price, period, tagline, highlighted, accent_color, features, whatsapp_msg, status, order_index
) VALUES (
  'mensual',
  'Plan Mensual Pase Libre',
  'Más Elegido · Presencial',
  '$ 1.400',
  'UYU / mes',
  'Acceso total a todos los días, turnos y grupos de entrenamiento en Durazno.',
  true,
  '#f59e0b',
  '[
    "Pase libre a todos los entrenamientos presenciales (Lunes a Sábado)",
    "Profesores de educación física guiando cada sesión en vivo",
    "Planificación deportiva según tus metas (desde iniciación a maratón)",
    "Entrenamientos en pista, ribera del Río Yí y senderos",
    "Descuento exclusivo en inscripciones a Trillo Eventos (San Pedro)",
    "Acceso preferencial a expediciones de Trillo Aventuras",
    "Fondos grupales y tercer tiempo de camaradería los fines de semana",
    "Seguro deportivo de accidentes personales incluido"
  ]'::jsonb,
  'Hola Trillo! Quiero afiliarme a El Club de Corredores con el Plan Mensual Pase Libre ($1.400/mes). ¿Cuáles son los próximos pasos?',
  'published',
  1
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  badge = EXCLUDED.badge,
  price = EXCLUDED.price,
  period = EXCLUDED.period,
  tagline = EXCLUDED.tagline,
  highlighted = EXCLUDED.highlighted,
  accent_color = EXCLUDED.accent_color,
  features = EXCLUDED.features,
  whatsapp_msg = EXCLUDED.whatsapp_msg,
  status = EXCLUDED.status,
  order_index = EXCLUDED.order_index;

INSERT INTO club_plans (
  slug, name, badge, price, period, tagline, highlighted, accent_color, features, whatsapp_msg, status, order_index
) VALUES (
  'semestral',
  'Plan Semestral Bonificado',
  'Remera Oficial Incluida',
  '$ 1.200',
  'UYU / mes (Abono semestral)',
  'Para quienes hacen del movimiento un estilo de vida continuo todo el año.',
  false,
  '#fbbf24',
  '[
    "Todos los beneficios del Plan Mensual Pase Libre",
    "Remera técnica oficial de entrenamiento del Club de regalo",
    "Ahorro directo en la cuota mensual",
    "20% de descuento asegurado en la Corrida San Pedro",
    "Congelamiento de cuota por 6 meses",
    "Prioridad absoluta en indumentaria y cupos de eventos"
  ]'::jsonb,
  'Hola Trillo! Quiero afiliarme con el Plan Semestral Bonificado de El Club de Corredores.',
  'published',
  2
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  badge = EXCLUDED.badge,
  price = EXCLUDED.price,
  period = EXCLUDED.period,
  tagline = EXCLUDED.tagline,
  highlighted = EXCLUDED.highlighted,
  accent_color = EXCLUDED.accent_color,
  features = EXCLUDED.features,
  whatsapp_msg = EXCLUDED.whatsapp_msg,
  status = EXCLUDED.status,
  order_index = EXCLUDED.order_index;

INSERT INTO club_plans (
  slug, name, badge, price, period, tagline, highlighted, accent_color, features, whatsapp_msg, status, order_index
) VALUES (
  'distancia',
  'Plan a Distancia',
  'Todo Uruguay',
  '$ 1.100',
  'UYU / mes',
  'Entrená con nuestra metodología y seguimiento estés donde estés en el país.',
  false,
  '#d8cfc4',
  '[
    "Planificación semanal personalizada según tus tiempos y objetivos",
    "Preparación específica para 5K, 10K, 21K, 42K o Trail",
    "Contacto directo y feedback semanal con los entrenadores",
    "Ajustes continuos de ritmos según datos de tu reloj o app",
    "Descuentos en carreras del circuito Trillo",
    "Comunidad online y apoyo constante"
  ]'::jsonb,
  'Hola Trillo! Me interesa contratar el Plan a Distancia de El Club de Corredores.',
  'published',
  3
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  badge = EXCLUDED.badge,
  price = EXCLUDED.price,
  period = EXCLUDED.period,
  tagline = EXCLUDED.tagline,
  highlighted = EXCLUDED.highlighted,
  accent_color = EXCLUDED.accent_color,
  features = EXCLUDED.features,
  whatsapp_msg = EXCLUDED.whatsapp_msg,
  status = EXCLUDED.status,
  order_index = EXCLUDED.order_index;
