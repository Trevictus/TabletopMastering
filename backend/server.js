require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const gameRoutes = require('./routes/gameRoutes');
const matchRoutes = require('./routes/matchRoutes');

// Crear la aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares globales
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎲 Bienvenido a Tabletop Mastering API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      groups: '/api/groups',
      games: '/api/games',
      matches: '/api/matches',
    },
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/matches', matchRoutes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware para manejo de errores
app.use(errorHandler);

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║                                               ║');
  console.log('║       🎲 TABLETOP MASTERING API 🎲           ║');
  console.log('║                                               ║');
  console.log('╚═══════════════════════════════════════════════╝');
  console.log(`🚀 Servidor corriendo en modo ${process.env.NODE_ENV}`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📚 Documentación: http://localhost:${PORT}/`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('👋 Señal SIGTERM recibida, cerrando el servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
  });
});

module.exports = app;
