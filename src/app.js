import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { query } from './config/db.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import adventuresRoutes from './routes/adventuresRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import clubPlansRoutes from './routes/clubPlansRoutes.js';

dotenv.config();

const app = express();

// 1. Configuración dinámica y segura de CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,https://trilloeventos.com,https://www.trilloeventos.com')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como herramientas de prueba curl, Postman o server-to-server)
      if (!origin) return callback(null, true);

      // Coincidencia exacta con dominios permitidos
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Permitir localhost en cualquier puerto para desarrollo local
      if (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Permitir URLs de preview de Vercel
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      callback(new Error(`CORS bloqueó el acceso desde el origen: ${origin}`));
    },
    credentials: true, // Imprescindible para el envío y recepción de cookies HttpOnly
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 3. Endpoint de bienvenida
app.get('/', (req, res) => {
  res.json({
    name: 'TRILLO EVENTOS API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// 4. Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/adventures', adventuresRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/club-plans', clubPlansRoutes);


// 5. Endpoint de Salud y Diagnóstico de Base de Datos
app.get('/api/health', async (req, res, next) => {
  const startTime = Date.now();
  try {
    const dbRes = await query('SELECT NOW() as db_time, version() as db_version');
    const latencyMs = Date.now() - startTime;

    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        latency: `${latencyMs}ms`,
        serverTime: dbRes.rows[0].db_time,
      },
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (err) {
    next(new Error(`Fallo de conexión con la base de datos: ${err.message}`));
  }
});

// 5. Manejo de 404 para rutas inexistentes
app.use(notFoundHandler);

// 6. Manejador global de excepciones
app.use(errorHandler);

export default app;
