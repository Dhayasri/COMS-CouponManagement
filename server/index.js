require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');

const couponRoutes = require('./routes/coupons');
const offerRoutes  = require('./routes/offers');

const app  = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:4173',   // Vite preview
    'http://127.0.0.1:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Mount coupon routes at both paths to match the spec:
//   GET  /api/coupons   → all coupons
//   POST /api/coupon    → create (singular)
//   DELETE /api/coupon/:id → delete (singular)
app.use('/api/coupons', couponRoutes);   // plural — GET all, PUT/:id, DELETE/:id
app.use('/api/coupon',  couponRoutes);   // singular — POST, DELETE/:id (same handler)

app.use('/api/offers', offerRoutes);     // plural
app.use('/api/offer',  offerRoutes);     // singular

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'COMS API',
    time: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ─── Global error handler ──────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ success: false, error: err.message });
});

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not set in .env file');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('');
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║       COMS API Server — Started           ║');
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`║  API   →  http://localhost:${PORT}/api       ║`);
    console.log(`║  DB    →  ${MONGO_URI.slice(0, 36)}  ║`);
    console.log('╚═══════════════════════════════════════════╝');
    console.log('');

    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Listening on port ${PORT} ...`);
      });
    }
  })
  .catch((err) => {
    console.error('');
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('');
    console.error('  Make sure MongoDB is running and MONGO_URI in .env is correct.');
    console.error(`  Current MONGO_URI: ${MONGO_URI}`);
    console.error('');
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('\nMongoDB disconnected. Server stopped.');
  process.exit(0);
});

module.exports = app;
