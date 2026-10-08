import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 TRILLO BACKEND iniciado exitosamente`);
  console.log(`📡 URL local: http://localhost:${PORT}`);
  console.log(`🩺 Salud:    http://localhost:${PORT}/api/health`);
  console.log(`🌍 Entorno:  ${process.env.NODE_ENV || 'development'}\n`);
});

// Manejo elegante de cierre del servidor
process.on('SIGTERM', () => {
  console.log('Recibido SIGTERM. Cerrando servidor...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Recibido SIGINT. Cerrando servidor...');
  server.close(() => process.exit(0));
});
