const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'backend-api'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create a histogram metric
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Register the histogram
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware function to collect metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
};

// Metrics endpoint
const metricsRoute = (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
};

module.exports = {
  metricsMiddleware,
  metricsRoute,
  register
};