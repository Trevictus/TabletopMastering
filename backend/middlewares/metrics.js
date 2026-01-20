/**
 * @fileoverview Middleware de métricas Prometheus para Express
 * @description Expone métricas HTTP en /metrics para Prometheus
 */

const client = require('prom-client');

// Crear registro
const register = new client.Registry();

// Métricas por defecto (CPU, memoria, etc.)
client.collectDefaultMetrics({ register });

// Contador de requests HTTP
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// Histograma de duración de requests
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de peticiones HTTP en segundos',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
  registers: [register],
});

/**
 * Middleware que registra métricas de cada petición
 */
const metricsMiddleware = (req, res, next) => {
  // Ignorar la ruta /metrics
  if (req.path === '/metrics') {
    return next();
  }

  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds + nanoseconds / 1e9;

    // Normalizar ruta para evitar cardinalidad alta
    const route = req.route?.path || req.path.replace(/\/[a-f0-9]{24}/g, '/:id');

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });

    httpRequestDuration.observe(
      { method: req.method, route, status: res.statusCode },
      duration
    );
  });

  next();
};

/**
 * Handler para exponer métricas en /metrics
 */
const metricsHandler = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
};

module.exports = { metricsMiddleware, metricsHandler };
