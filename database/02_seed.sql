-- =======================================================
-- TRILLO EVENTOS - SCRIPT DE DATOS SEMILLA (SEED DATA)
-- Con URLs verificadas de Cloudinary (Cloud Name: pglfifpm)
-- =======================================================

-- -------------------------------------------------------
-- 1. SEED: EVENTS (3 Carreras Oficiales)
-- -------------------------------------------------------
INSERT INTO events (
  slug, title, subtitle, badge, season, date_text, location,
  elevation, difficulty, terrain, image_url, accent_color,
  short_description, description, distances, highlights,
  kit_includes, schedule, whatsapp_msg, status, order_index
)
VALUES
(
  'desafio-rebollo',
  'Desafío Rebollo',
  'Trail Running, Sierra Agreste & Desnivel',
  'Trail Puro',
  'Otoño 2027',
  'Mayo 2027 · Durazno',
  'Rincón de Rebollo, Durazno',
  '+520m Desnivel Positivo',
  'Media - Alta',
  'Senderos de sierra, canteras de piedra, cañadas y monte nativo',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462580/trillo/events/eventosverti.jpg',
  '#f97316',
  'Una prueba para corredores que buscan contacto visceral con la naturaleza. El Desafío Rebollo se interna en las quebradas y cerros más agrestes de Durazno.',
  'El Desafío Rebollo es una experiencia de trail running auténtica en el corazón geográfico del Uruguay. Diseñada para quienes disfrutan de los senderos rocosos, las subidas pronunciadas y el monte agreste. Con distancias accesibles para quienes debutan en el trail (7K) hasta un circuito de 25K de alta exigencia que demanda piernas, concentración y espíritu de montaña.',
  '["7K Participativo", "15K Competitivo", "25K Trail Extremo"]'::jsonb,
  '[
    "Circuito 100% agreste sin asfalto ni calles de tránsito vehicular",
    "Cruce de cañadas naturales de agua clara y monte nativo virgen",
    "Cronometraje digital con chip descartable de máxima precisión",
    "Puestos de hidratación isotónica y frutas frescas cada 4 km",
    "Medalla Finisher metálica conmemorativa de fundición pesada",
    "Remera técnica oficial Trillo Trail de alta evaporación"
  ]'::jsonb,
  '[
    "Remera técnica oficial Desafío Rebollo Micro-Dry",
    "Número de corredor con chip descartable incorporado",
    "Medalla Finisher troquelada para todos los llegados",
    "Seguro de accidentes personales de la competencia",
    "Puntos de abastecimiento con agua, isotónica y frutas",
    "Asistencia médica y patrullaje de rescate en el circuito"
  ]'::jsonb,
  '[
    {"time": "07:30 HS", "activity": "Acreditación y retiro de kits en campamento base"},
    {"time": "08:45 HS", "activity": "Charla técnica de seguridad y descripción del circuito"},
    {"time": "09:00 HS", "activity": "Largada simultánea categorías competitivas 25K y 15K"},
    {"time": "09:15 HS", "activity": "Largada categoría participativa 7K"},
    {"time": "12:30 HS", "activity": "Tercer tiempo con música en vivo y entrega de trofeos"}
  ]'::jsonb,
  'Hola Trillo! Quiero información e inscribirme en el Desafío Rebollo de Trail en Durazno.',
  'published',
  1
),
(
  'laberinto',
  'Carrera del Laberinto',
  'Cross Country Técnico & Velocidad Pura',
  'Cross Dinámico',
  'Invierno 2027',
  'Agosto 2027 · Durazno',
  'Circuito El Laberinto, Durazno',
  '+210m Desnivel Dinámico',
  'Media',
  'Senderos serpenteantes, bancos de arena, repechos cortos y barro',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462582/trillo/events/san_pedro_night.jpg',
  '#eab308',
  'Un trazado enigmático y electrizante que rompe la monotonía. Curvas cerradas, repechos explosivos y aceleración constante entre árboles.',
  'La Carrera del Laberinto es un desafío táctico donde no gana solo quien corre más rápido en línea recta, sino quien mejor sabe cambiar de ritmo y anticipar cada curva. Con un circuito entrelazado que ofrece vistas continuas para el público y familiares, se ha convertido en una de las pruebas más divertidas e intensas del calendario atlético.',
  '["5K Promocional", "10K Desafío Total"]'::jsonb,
  '[
    "Trazado tipo laberinto natural con constantes quiebres y curvas cerradas",
    "Sectores de bosque cerrado con túneles de ramas y bancos de arena",
    "Visuales continuas para el público y acompañantes en todo el predio",
    "Competencia contrarreloj por mangas y tanda general",
    "Kit con indumentaria técnica y gorra de carrera exclusiva",
    "Premiación por categorías de edad y reconocimientos a récords de vuelta"
  ]'::jsonb,
  '[
    "Remera técnica de secado ultra-rápido Laberinto",
    "Chip electrónico de cronometraje por vueltas y sectores",
    "Medalla Finisher artesanal de acero inoxidable",
    "Dorsal tyvek impermeable resistente al barro y sudor",
    "Frutas, barras energéticas e hidratación al cruzar la meta",
    "Cobertura de emergencia móvil durante toda la carrera"
  ]'::jsonb,
  '[
    {"time": "14:00 HS", "activity": "Apertura de parque cerrado y entrega de dorsales"},
    {"time": "15:15 HS", "activity": "Reconocimiento del trazado y entrada en calor guiada"},
    {"time": "15:45 HS", "activity": "Largada oficial 5K y 10K Laberinto"},
    {"time": "17:30 HS", "activity": "Premiación de podios generales y por edades"},
    {"time": "18:00 HS", "activity": "Cierre con fogón y convivencia en el circuito"}
  ]'::jsonb,
  'Hola Trillo! Me interesa sumarme a la Carrera del Laberinto en Durazno. ¿Cómo reservo mi cupo?',
  'published',
  2
),
(
  'san-pedro',
  'Corrida San Pedro',
  'La Gran Fiesta del Running & Atardecer',
  'Edición Oficial',
  'Primavera 2026',
  'Sábado 21 de Noviembre · 18:30 HS',
  'Plaza San Pedro & Rambla del Río Yí, Durazno',
  '+140m Desnivel Urbano-Costero',
  'Apta para todos los niveles',
  'Avenida histórica, costanera asfaltada y rambla del Río Yí',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462579/trillo/ui/hero-backgrounds/eventos-hero.png',
  '#e87a38',
  'El evento insignia de la comunidad atlética de Durazno. Cientos de atletas corriendo al atardecer entre bengalas, tambores y el Río Yí.',
  'La Corrida San Pedro es la prueba más convocante y emblemática del interior del país organizada por Trillo. Una verdadera fiesta popular donde corredores de élite, grupos de entrenamiento, aficionados y familias enteras largan con el sol bajando sobre la Plaza San Pedro. El circuito recorre las calles históricas y bordea el Río Yí, culminando con fiesta, medallas y un tercer tiempo inolvidable.',
  '["5K Recreativa", "10K Competitiva Oficial"]'::jsonb,
  '[
    "La carrera más multitudinaria y festiva de la región centro",
    "Recorrido escénico cruzando los puntos históricos de San Pedro y el Río Yí",
    "Largada al caer el sol con bengalas de humo, luces y animación en vivo",
    "Puntos de aliento con batucadas y vecinos en todo el recorrido",
    "Medalla Finisher coleccionable con relieve arquitectónico",
    "Gran fiesta de premiación en la plaza con gastronomía y tercer tiempo"
  ]'::jsonb,
  '[
    "Remera oficial Corrida San Pedro con tecnología Micro-Dry",
    "Chip descartable integrado al dorsal numerado oficial",
    "Medalla de finalista metálica de alto relieve con cinta sublimada",
    "Garantía de hidratación con sachets cada 2.5K y en la meta",
    "Seguro de cobertura médica deportiva del corredor",
    "Acceso al sector de recuperación con frutas, masajes y fisioterapia"
  ]'::jsonb,
  '[
    {"time": "15:30 HS", "activity": "Feria del corredor, retiro de kits y música en Plaza San Pedro"},
    {"time": "18:00 HS", "activity": "Calentamiento masivo con los profes de Trillo Club"},
    {"time": "18:30 HS", "activity": "Cuenta regresiva y largada oficial 5K y 10K San Pedro"},
    {"time": "19:45 HS", "activity": "Llegadas masivas, hidratación y música en el arco de meta"},
    {"time": "20:30 HS", "activity": "Ceremonia de premiación, trofeos y festejo comunitario"}
  ]'::jsonb,
  'Hola Trillo! Quiero anotarme en la Corrida San Pedro en Durazno. ¿Cómo confirmo mi inscripción?',
  'published',
  3
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  image_url = EXCLUDED.image_url,
  distances = EXCLUDED.distances,
  highlights = EXCLUDED.highlights,
  kit_includes = EXCLUDED.kit_includes,
  schedule = EXCLUDED.schedule;

-- -------------------------------------------------------
-- 2. SEED: ADVENTURES (9 Expediciones en 3 Categorías)
-- -------------------------------------------------------
INSERT INTO adventures (
  slug, category, title, subtitle, badge, location, duration,
  difficulty, distance, elevation, group_size, image_url,
  description, highlights, itinerary, included, requirements,
  whatsapp_msg, status, order_index
)
VALUES
(
  'kayak-rio-yi',
  'durazno',
  'Travesía Kayak Río Yí Salvaje',
  'Aguas tranquilas, correderas y noche bajo estrellas en monte nativo',
  'Fluvial & Bivouac',
  'Río Yí · Durazno',
  '2 Días / 1 Noche',
  'Intermedia',
  '38 km navegables',
  'Sin desnivel (Fluvial)',
  'Máx. 12 personas',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'Una inmersión absoluta en el corazón de Durazno navegando el Río Yí por tramos inaccesibles por tierra. Remaremos entre bosques de galería, islotes de arena blanca y correderas naturales, culminando con un campamento de campo con fogón bajo las estrellas.',
  '["Navegación en kayaks estables de travesía simples y dobles", "Campamento agreste en arenal privado con fogón tradicional", "Avistamiento de aves ribereñas (martín pescador, garzas, biguás)", "Cocina rústica a las brasas y charla bajo el cielo nocturno"]'::jsonb,
  '[
    {"day": "Día 1", "title": "Zarpada y primeros meandros", "detail": "Punto de encuentro en Durazno a las 08:30 HS. Charla de seguridad, armado de bultos estancos y botadura. 20 km de remo con parada de almuerzo en playa agreste. Armado de campamento al atardecer y cena al fuego."},
    {"day": "Día 2", "title": "Correderas de piedra y arribo", "detail": "Desayuno de campamento al amanecer con neblina sobre el río. 18 km finales atravesando correderas divertidas. Almuerzo de cierre y transfer de retorno a la base."}
  ]'::jsonb,
  '["Kayaks de travesía, chalecos salvavidas DAF certificados y remos ergonómicos", "Bolsas estancas para equipaje personal", "Guías locales certificados y lancha de apoyo con comunicación VHF", "Todas las comidas de campo (2 almuerzos, 1 cena al fuego, 1 desayuno)", "Seguro de accidentes personales y asistencia médica"]'::jsonb,
  '["Saber nadar nivel básico", "Ropa deportiva de secado rápido y muda completa", "Bolsa de dormir y aislante (disponible en alquiler)", "Repelente, protector solar y linterna frontal"]'::jsonb,
  'Hola Trillo! Me interesa conocer más sobre la Travesía en Kayak por el Río Yí. ¿Qué fechas próximas tienen disponibles?',
  'published',
  1
),
(
  'trekking-montes-yi',
  'durazno',
  'Trekking Montes Nativos & Quebradas',
  'Sendero agreste por cañadas vírgenes y monte indígena tupido',
  'Trekking Botánico',
  'Montes del Yí · Durazno',
  '1 Día completo',
  'Física Moderada',
  '16 km senderismo',
  '+180m acumulados',
  'Máx. 15 personas',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  'Exploramos los secretos mejor guardados del monte nativo duraznense. Caminaremos por senderos de animales, cañadas de aguas cristalinas y formaciones geológicas antiguas, acompañados de guías con profundo conocimiento de la flora medicinal y fauna autóctona.',
  '["Caminata por monte galería virgen sin senderos comerciales", "Reconocimiento de especies autóctonas (coronilla, espinillo, arrayán)", "Pozones naturales para refrescarse en días de calor", "Picada campera de campo con productos locales de Durazno"]'::jsonb,
  '[
    {"day": "Jornada Única", "title": "Travesía de exploración completa", "detail": "08:00 HS concentración en Durazno. Traslado 4x4 al punto de inicio. Trekking matutino de 8 km por monte cerrado. Almuerzo campestre en playita de cañada. Regreso por lomas con vistas panorámicas del departamento hacia las 17:30 HS."}
  ]'::jsonb,
  '["Guías expertos en monte autóctono y primeros auxilios agrestes (WFR)", "Almuerzo campestre y snacks energéticos de marcha", "Botiquín de primeros auxilios y comunicaciones satelitales", "Seguro deportivo individual"]'::jsonb,
  '["Calzado cerrado con buena tracción (zapatillas de trail o botitas de trekking)", "Pantalón largo (monte espinoso)", "Mochila pequeña con al menos 2 litros de agua personal"]'::jsonb,
  'Hola Trillo! Quisiera sumarme al Trekking Montes Nativos en Durazno. ¿Cuándo sale el próximo grupo?',
  'published',
  2
),
(
  'gravel-canteras-san-pedro',
  'durazno',
  'Gravel & MTB Senderos de San Pedro',
  'Caminos rurales olvidados, canteras de piedra y atardecer campestre',
  'Ciclismo & Aventura',
  'Zona Rural San Pedro · Durazno',
  '1 Jornada (Atardecer)',
  'Media',
  '48 km ripio y senderos',
  '+320m desnivel',
  'Máx. 14 ciclistas',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
  'Pedaleamos por la verdadera topografía del campo duraznense: caminos vecinales de tierra roja, canteras de basalto abandonadas, cruces de vados y bosques de eucaliptus infinitos. Finalizamos con un tercer tiempo cervecero y fogón.',
  '["Ruta mixta diseñada para bicicletas de Gravel y MTB", "Vehículo de apoyo (SAG wagon) para hidratación y asistencia mecánica", "Paradas fotográficas en canteras con vistas panorámicas", "After-ride tradicional con tercer tiempo en estancia rural"]'::jsonb,
  '[
    {"day": "Jornada", "title": "Travesía en dos ruedas al atardecer", "detail": "14:00 HS chequeo técnico y briefing. Pedaleo continuo en pelotón recreativo con reagrupamientos en puntos clave. Llegada al atardecer para el tercer tiempo a las 19:30 HS."}
  ]'::jsonb,
  '["Vehículo de soporte con mecánico, repuestos y bebidas frías", "Guía líder de pedaleo y barredor de cierre de pelotón", "Merienda de campo energética y tercer tiempo completo", "Seguro de cobertura deportiva"]'::jsonb,
  '["Bicicleta en correcto estado mecánico (Gravel o Mountain Bike)", "Casco rígido obligatorio durante todo el trayecto", "Cámara de repuesto propia compatible con su rodado"]'::jsonb,
  'Hola Trillo! Me interesa la salida de Gravel y MTB en San Pedro. ¿Cuáles son los requisitos de la bici?',
  'published',
  3
),
(
  'quebrada-cuervos',
  'nacionales',
  'Expedición Cañón Quebrada de los Cuervos',
  'El primer Paisaje Protegido de Uruguay: cañón fluvial y microclima subtropical',
  'Trekk & Cañón',
  'Treinta y Tres · Uruguay',
  '2 Días / 1 Noche',
  'Media - Alta',
  '22 km totales',
  '+450m acumulados',
  'Máx. 12 personas',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  'Descendemos al fondo del cañón del Arroyo Yerbal Chico en una de las formaciones geológicas más espectaculares del país. Microclima subtropical, helechos arborescentes, pozos de agua verde esmeralda y acantilados imponentes.',
  '["Descenso técnico al lecho rocoso del Yerbal Chico", "Noche en cabañas rústicas de montaña o campamento bajo estrellas", "Pozones profundos ideales para nadar en agua pura de sierra", "Ascenso a miradores con panorámicas del cañón infinito"]'::jsonb,
  '[
    {"day": "Día 1", "title": "Llegada y descenso a la garganta", "detail": "Encuentro en Treinta y Tres. Traslado a la reserva. Descenso técnico de 10 km por senderos de piedra hasta el fondo del cañón. Armado de campamento y baño en pozones."},
    {"day": "Día 2", "title": "Ascenso y mirador panorámico", "detail": "Trekking de 12 km recorriendo las crestas superiores del cañón con vistas a 360 grados. Almuerzo serrano y despedida hacia las 17:00 HS."}
  ]'::jsonb,
  '["Guías certificados de trekking agreste y primeros auxilios WFR", "Todas las comidas durante la expedición", "Alojamiento en el predio protegido", "Ingresos y permisos del Sistema Nacional de Áreas Protegidas (SNAP)"]'::jsonb,
  '["Buen estado aeróbico para caminar con desnivel sostenido", "Calzado de montaña con suela vibram o equivalente", "Mochila técnica de al menos 40 litros"]'::jsonb,
  'Hola Trillo! Quiero sumarme a la expedición a Quebrada de los Cuervos. ¿Tienen fechas abiertas?',
  'published',
  4
),
(
  'sierras-minas',
  'nacionales',
  'Travesía Crestas de las Sierras de Minas',
  'Filos rocosos, Cerro Campanero y valles profundos de Lavalleja',
  'Alta Serranía',
  'Lavalleja · Uruguay',
  '2 Días / 1 Noche',
  'Alta (Técnica)',
  '26 km travesía',
  '+780m desnivel+',
  'Máx. 10 personas',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'Caminata por las cumbres más elevadas y agrestes de las Sierras de Minas. Recorrido por filos expuestos al viento serrano, cañadas ocultas y noche en refugio de montaña con gastronomía casera de la comarca minuana.',
  '["Cumbres del Cerro Campanero y cordones serranos linderos", "El mayor desnivel acumulado de trekking en territorio uruguayo", "Noche en refugio serrano con estufa a leña y comida de olla", "Atardecer monumental con vista infinita hacia el este"]'::jsonb,
  '[
    {"day": "Día 1", "title": "El ascenso a los filos", "detail": "Salida desde Minas. Ascenso continuo por canteras y pastizales altos hasta ganar el filo de la sierra. 14 km con vistas que alcanzan el horizonte atlántico. Arribo al refugio."},
    {"day": "Día 2", "title": "Quebradas y bajada técnica", "detail": "12 km por cañadas escondidas con vegetación serrana virgen. Descenso técnico por terreno rocoso y cierre en pulpería tradicional."}
  ]'::jsonb,
  '["Guías especializados en montaña y socorrismo", "Estadía completa en refugio de campo", "Cena criolla de olla, desayunos y viandas energéticas", "Seguro médico y rescate agreste"]'::jsonb,
  '["Experiencia previa en caminatas de terreno pedregoso", "Bastones de trekking recomendados", "Ropa técnica por capas (viento fuerte en las cumbres)"]'::jsonb,
  'Hola Trillo! Me interesa la Travesía en Sierras de Minas. ¿Qué nivel de exigencia se necesita?',
  'published',
  5
),
(
  'dunas-cabo-polonio',
  'nacionales',
  'Travesía Oceánica Valizas — Cabo Polonio',
  'Dunas vivas gigantes, costa atlántica salvaje y mística nocturna',
  'Dunas & Océano',
  'Rocha · Uruguay',
  '2 Días / 1 Noche',
  'Moderada',
  '20 km costeros',
  '+110m (Dunas)',
  'Máx. 14 personas',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'Una travesía que combina el desierto de dunas móviles más alto de la costa platense con la soledad del océano Atlántico. Caminaremos desde Barra de Valizas cruzando el Cerro de la Buena Vista hasta arribar al enclave sin luz eléctrica de Cabo Polonio.',
  '["Cruce a pie del Cerro de la Buena Vista y dunas móviles", "Avistamiento de lobos marinos en el apostadero del Cabo", "Noche en posada sustentable con cielo nocturno libre de polución lumínica", "Amanecer sobre el océano abierto junto al Faro histórico"]'::jsonb,
  '[
    {"day": "Día 1", "title": "El desierto y la llegada al Cabo", "detail": "Cruce en bote del Arroyo Valizas. Marcha de 10 km por dunas y costa atlántica. Arribo a pie a Cabo Polonio al atardecer. Cena marinera y noche de fogón."},
    {"day": "Día 2", "title": "Lobos marinos y retorno oceánico", "detail": "Visita guiada a las rocas del Faro. 10 km de caminata por playa virgen o regreso en camiones 4x4 según la opción del grupo."}
  ]'::jsonb,
  '["Guía local acreditado conocedor de la marea y el viento", "Alojamiento en posada rústica en Cabo Polonio", "Cena completa con pesca del día y desayunos de campo", "Cruce en bote y traslados 4x4 autorizados"]'::jsonb,
  '["Protección solar extrema (arena reflectiva y viento salino)", "Calzado apto para arena y agua", "Mochila liviana"]'::jsonb,
  'Hola Trillo! Quisiera sumarme a la Travesía Valizas - Cabo Polonio. ¿Cuándo sale el próximo grupo?',
  'published',
  6
),
(
  'cruce-andes',
  'internacionales',
  'Expedición Cruce de los Andes a Caballo y a Pie',
  'La gran epopeya sanmartiniana: valles glaciares, pasos a 4.000m y cordillera pura',
  'Alta Montaña',
  'Mendoza · Argentina',
  '6 Días / 5 Noches',
  'Alta',
  '110 km cordilleranos',
  '+4.200m msnm',
  'Máx. 10 expedicionarios',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  'Una de las aventuras más trascendentes del continente sudamericano. Cruzamos la Cordillera de los Andes siguiendo las rutas históricas de la cordillera mendocina, acampando junto a glaciares de altura y durmiendo bajo el cielo más transparente del planeta.',
  '["Ascenso a pasos fronterizos por encima de los 4.000 metros de altura", "Mulas cargueras y campamentos de montaña de alta cota", "Asados criollos cordilleranos con arrieros locales de pura estirpe", "Vistas monumentales a picos nevados eternos"]'::jsonb,
  '[
    {"day": "Día 1-2", "title": "Aclimatación y valle del Portillo", "detail": "Salida de Tunuyán. Ascenso progresivo por el Valle de las Yaretas hasta los 3.000m. Primer campamento cordillerano."},
    {"day": "Día 3-4", "title": "El cruce del Paso del Portillo a 4.380m", "detail": "Jornada épica superando el punto culminante. Descenso al Valle del Río Tunuyán en campamento Real de la Cruz."},
    {"day": "Día 5-6", "title": "Límite internacional y regreso triunfal", "detail": "Hito fronterizo con Chile. Almuerzo de camaradería y regreso a Mendoza para la cena de gala de cierre."}
  ]'::jsonb,
  '["Guías de alta montaña AAGM / UIAGM y arrieros baqueanos mendocinos", "Mulas para transporte de equipo pesado y monturas para tramos a caballo", "Todas las comidas de montaña de primer nivel durante los 6 días", "Teléfono satelital, botiquín de altura (GASP) y oxígeno medicinal"]'::jsonb,
  '["Apto médico cardiovascular firmado", "Equipo técnico de montaña (bolsa -15°C, campera pluma, botas)", "Disposición para convivencia agreste sin comodidades urbanas"]'::jsonb,
  'Hola Trillo! Me interesa la expedición Cruce de los Andes. ¿Tienen el dossier completo con fechas?',
  'published',
  7
),
(
  'glaciares-chalten',
  'internacionales',
  'Trekking Patagonia: Fitz Roy & Cerro Torre',
  'La capital nacional del trekking: agujas de granito, lagunas glaciares y bosques fueguinos',
  'Patagonia Salvaje',
  'El Chaltén · Santa Cruz, Argentina',
  '5 Días / 4 Noches',
  'Media - Alta',
  '65 km de senderos',
  '+1.200m acumulados',
  'Máx. 12 personas',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  'Caminamos frente a las paredes verticales más míticas del alpinismo mundial. La Laguna de los Tres a los pies del imponente Monte Fitz Roy, el campamento De Agostini frente a las agujas del Cerro Torre y el Glaciar Grande.',
  '["Amanecer dorado iluminando las paredes de granito del Fitz Roy", "Trekking hasta el mirador de la Laguna Torre y témpanos flotantes", "Bosques de lengas milenarias con fauna autóctona (carpinteros, huemules)", "Cerveza artesanal patagónica en los refugios de El Chaltén"]'::jsonb,
  '[
    {"day": "Día 1", "title": "Arribo a El Chaltén y Laguna Capri", "detail": "Recepción en El Calafate y transfer al pueblo de montaña. Caminata suave de 8 km a Laguna Capri para la primera vista del macizo."},
    {"day": "Día 2", "title": "Laguna de los Tres / Fitz Roy", "detail": "La jornada reina: 22 km ida y vuelta con el exigente kilómetro final hasta la base del Fitz Roy."},
    {"day": "Día 3-4", "title": "Cerro Torre & Paso del Viento", "detail": "Trekking al glaciar del Cerro Torre y sendero Pliegue Tumbado con panorámica total."},
    {"day": "Día 5", "title": "Cierre y transfer", "detail": "Desayuno patagónico, compras de souvenirs de montaña y regreso."}
  ]'::jsonb,
  '["Guías bilingües habilitados por Parques Nacionales", "Alojamiento en hostería céntrica con desayuno casero", "Box-lunches energéticos para todas las caminatas", "Transfers privados desde y hacia el aeropuerto de El Calafate"]'::jsonb,
  '["Botas de trekking impermeables (Gore-Tex o membrana)", "Indumentaria técnica contra el viento patagónico (Windstopper / Softshell)", "Mochila de ataque de 25-30 litros"]'::jsonb,
  'Hola Trillo! Quisiera información para la expedición de Trekking en El Chaltén con Trillo.',
  'published',
  8
),
(
  'quebrada-condorito',
  'internacionales',
  'Travesía Pampa de Achala & Quebrada del Condorito',
  'Vuelo de cóndores andinos a metros de distancia, pastizales de altura y quebradas profundas',
  'Altas Cumbres',
  'Córdoba · Argentina',
  '3 Días / 2 Noches',
  'Media',
  '34 km senderismo',
  '+600m acumulados',
  'Máx. 12 personas',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
  'En las Altas Cumbres cordobesas, a más de 2.000 metros sobre el nivel del mar, se abre una garganta gigantesca de 800 metros de profundidad donde anida una de las mayores poblaciones de cóndor andino del cono sur.',
  '["Balcón Norte y Balcón Sur con avistamiento de cóndores en planeo rasante", "Paso por los bosques de tabaquillos, árboles únicos de la alta montaña", "Cena criolla de campo con chivito serrano y vinos regionales", "Cielos australes prístinos en la Pampa de Achala"]'::jsonb,
  '[
    {"day": "Día 1", "title": "Ascenso a la Pampa de Achala", "detail": "Concentración en Villa Carlos Paz. Ascenso vehicular a las Altas Cumbres. Marcha de 10 km por pampa de altura hasta el refugio."},
    {"day": "Día 2", "title": "La garganta de los cóndores", "detail": "16 km por el Parque Nacional hasta el Balcón Sur de la quebrada. Horas de contemplación de vuelos de cóndor a corta distancia."},
    {"day": "Día 3", "title": "Río subterráneo y despedida", "detail": "Descenso suave con parada en formaciones de granito y retorno a Córdoba hacia las 18:00 HS."}
  ]'::jsonb,
  '["Guías habilitados por la Administración de Parques Nacionales", "Alojamiento en refugio serrano tradicional con pensión completa", "Asado criollo serrano y meriendas de campo", "Seguro de accidentes personales"]'::jsonb,
  '["Calzado con buena adherencia para piedra lisa", "Mochila mediana", "Cámara de fotos o binoculares con buen alcance"]'::jsonb,
  'Hola Trillo! Me interesa la salida a Quebrada del Condorito en Córdoba. ¿Qué fechas tienen programadas?',
  'published',
  9
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary;

-- -------------------------------------------------------
-- 3. SEED: PRODUCTS (5 Prendas Oficiales de Tienda Trillo)
-- Con URLs reales de Cloudinary
-- -------------------------------------------------------
INSERT INTO products (
  slug, category, name, subtitle, price, currency, badge,
  front_image_url, back_image_url, full_mockup_url,
  description, features, sizes, size_guide, stock_status,
  status, order_index
)
VALUES
(
  'remera-sanpedro',
  'carreras',
  'Remera Técnica Corrida San Pedro 3ª Edición',
  'La Carrera de Durazno · Edición Conmemorativa',
  1190.00,
  'UYU',
  'Edición Oficial',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462585/trillo/products/remera-sanpedro-front.png',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462586/trillo/products/remera-sanpedro-back.png',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462587/trillo/products/remeras2-mockup.png',
  'Remera técnica de alto rendimiento en color rojo fuego con degradé a blanco, diseñada especialmente para la 3ª Edición de la Corrida San Pedro en Durazno. Presenta la emblemática estampa conmemorativa de la cultura duraznense y el monumento a las Llamadas.',
  '[
    "Poliéster Micro-Dry ultraliviano con evaporación instantánea",
    "Protección UV+30 para entrenamientos y carreras diurnas",
    "Costuras planas flatlock para eliminar el roce con la piel",
    "Sublimado digital de alta resolución que no pierde color con los lavados",
    "Corte unisex deportivo y ergonómico"
  ]'::jsonb,
  '["S", "M", "L", "XL", "XXL"]'::jsonb,
  '[
    {"size": "S", "ancho": "48 cm", "largo": "68 cm"},
    {"size": "M", "ancho": "51 cm", "largo": "70 cm"},
    {"size": "L", "ancho": "54 cm", "largo": "73 cm"},
    {"size": "XL", "ancho": "57 cm", "largo": "76 cm"},
    {"size": "XXL", "ancho": "60 cm", "largo": "78 cm"}
  ]'::jsonb,
  'available',
  'published',
  1
),
(
  'remera-cdc-magma',
  'club',
  'Remera Club de Corredores — Magma Pro',
  'Textura fluida fuego & negro con logo oficial CDC',
  1290.00,
  'UYU',
  'Más Elegida',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462588/trillo/products/remera-cdc-magma-front.png',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462589/trillo/products/remera-cdc-magma-back.png',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462590/trillo/products/remeras-cdc-mockup.png',
  'El modelo insignia de entrenamiento del Club de Corredores Durazno. Estampado envolvente de magma en tonos naranja brillante y grafito, cuello rib reforzado, bandera uruguaya en la manga y el gran emblema circular de El Club en la espalda.',
  '[
    "Tejido calado microperforado de máxima ventilación",
    "Estampado orgánico magma 360° de impacto visual único",
    "Logo oficial circular Club de Corredores Durazno al dorso",
    "Detalle patrio: bandera de Uruguay en la manga izquierda",
    "Secado exprés para sesiones intensas de running y trail"
  ]'::jsonb,
  '["S", "M", "L", "XL", "XXL"]'::jsonb,
  '[
    {"size": "S", "ancho": "48 cm", "largo": "68 cm"},
    {"size": "M", "ancho": "51 cm", "largo": "70 cm"},
    {"size": "L", "ancho": "54 cm", "largo": "73 cm"},
    {"size": "XL", "ancho": "57 cm", "largo": "76 cm"},
    {"size": "XXL", "ancho": "60 cm", "largo": "78 cm"}
  ]'::jsonb,
  'available',
  'published',
  2
),
(
  'remera-cdc-indigo',
  'club',
  'Remera Club de Corredores — Indigo Wave',
  'Azul noche con degradé digital inspirado en el Río Yí',
  1290.00,
  'UYU',
  'Edición Río Yí',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462590/trillo/products/remera-cdc-blue-front.png',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462591/trillo/products/remera-cdc-blue-back.png',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462590/trillo/products/remeras-cdc-mockup.png',
  'Inspirada en el flujo constante y las aguas del Río Yí. Confeccionada en azul marino profundo con patrón de olas digitales en verde agua/cyan, sigla universitaria CDC en el pecho y el logo oficial en la espalda.',
  '[
    "Microfibra inteligente anti-olor y secado ultra veloz",
    "Diseño moderno atlético que combina sobriedad y dinamismo",
    "Terminaciones reforzadas en cuello y mangas",
    "Tratamiento hidrófugo que no absorbe peso con la transpiración",
    "Bandera de Uruguay en manga"
  ]'::jsonb,
  '["S", "M", "L", "XL", "XXL"]'::jsonb,
  '[
    {"size": "S", "ancho": "48 cm", "largo": "68 cm"},
    {"size": "M", "ancho": "51 cm", "largo": "70 cm"},
    {"size": "L", "ancho": "54 cm", "largo": "73 cm"},
    {"size": "XL", "ancho": "57 cm", "largo": "76 cm"},
    {"size": "XXL", "ancho": "60 cm", "largo": "78 cm"}
  ]'::jsonb,
  'available',
  'published',
  3
),
(
  'remera-oversize-negro',
  'streetwear',
  'Remera Oversize Streetwear — Negro Sólido Trillo',
  '100% Algodón Peinado Pesado · "El Ritmo de una Ciudad"',
  1350.00,
  'UYU',
  'Streetwear 24/1',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462592/trillo/products/remera-oversize-front.png',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462593/trillo/products/remera-oversize-back.png',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462593/trillo/products/remeras3-mockup.png',
  'La prenda urbana definitiva de Universo Trillo. Corte oversize relajado confeccionada en algodón 100% peinado pesado 24/1. Logo sutil Trillo en el pecho y obra serigráfica de tamboril de candombe con la frase "El Ritmo de una Ciudad · Corrida San Pedro · Durazno - Uruguay" en la espalda.',
  '[
    "100% Algodón peinado 24/1 de alto gramaje y tacto premium",
    "Calce oversize contemporáneo con hombros caídos",
    "Serigrafía al agua de alta resistencia al planchado y desgaste",
    "Cuello rib grueso de 3 cm que mantiene su forma lavado tras lavado",
    "Ideal para uso casual, viajes, tercer tiempo y vida cotidiana"
  ]'::jsonb,
  '["S", "M", "L", "XL"]'::jsonb,
  '[
    {"size": "S", "ancho": "55 cm", "largo": "72 cm"},
    {"size": "M", "ancho": "58 cm", "largo": "75 cm"},
    {"size": "L", "ancho": "61 cm", "largo": "78 cm"},
    {"size": "XL", "ancho": "64 cm", "largo": "81 cm"}
  ]'::jsonb,
  'available',
  'published',
  4
),
(
  'campera-club-corredores',
  'abrigo',
  'Campera Térmica Media Estación — TDH Sports x CDC',
  'Medio cierre, cuello alto y micropolar térmico respirable',
  2490.00,
  'UYU',
  'Oficial Atletas',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462594/trillo/products/campera-club.png',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462594/trillo/products/campera-club.png',
  'https://res.cloudinary.com/pglfifpm/image/upload/v1791462595/trillo/products/remeras4-mockup.png',
  'Campera de abrigo técnico y pre-competencia oficial del Club de Corredores Durazno en colaboración con TDH Sports. Confeccionada en blanco puro con paneles y hombros en naranja deportivo, medio cierre frontal YKK y escudo del Club estampado.',
  '[
    "Tejido elástico de media estación con interior perchado micropolar",
    "Cuello alto térmico con cremallera protegida en la barbilla",
    "Excelente aislamiento del viento matutino y vespertino en Durazno",
    "Puños elastizados que impiden la entrada de frío",
    "Escudo oficial Club de Corredores Durazno"
  ]'::jsonb,
  '["S", "M", "L", "XL", "XXL"]'::jsonb,
  '[
    {"size": "S", "ancho": "52 cm", "largo": "68 cm"},
    {"size": "M", "ancho": "55 cm", "largo": "70 cm"},
    {"size": "L", "ancho": "58 cm", "largo": "73 cm"},
    {"size": "XL", "ancho": "61 cm", "largo": "76 cm"},
    {"size": "XXL", "ancho": "64 cm", "largo": "79 cm"}
  ]'::jsonb,
  'available',
  'published',
  5
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  front_image_url = EXCLUDED.front_image_url,
  back_image_url = EXCLUDED.back_image_url,
  full_mockup_url = EXCLUDED.full_mockup_url,
  features = EXCLUDED.features,
  sizes = EXCLUDED.sizes,
  size_guide = EXCLUDED.size_guide;
