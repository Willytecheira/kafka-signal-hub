const http = require('http');
const fs = require('fs');
const path = require('path');
const { Kafka, logLevel } = require('kafkajs');
const { randomUUID } = require('crypto');

// ── Config ───────────────────────────────────────────────────────────
const BROKERS = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const TOPIC = process.env.KAFKA_TOPIC || 'bridgewise.alerts.normalized';
const GROUP_ID = process.env.KAFKA_GROUP_ID || 'lovable-signals-app';
const PORT = parseInt(process.env.PORT || '3000', 10);
const MAX_SIGNALS = 100;

// ── Signal store ─────────────────────────────────────────────────────
const signals = [];

function normalize(raw) {
  return {
    id: raw.id || randomUUID(),
    timestamp: raw.timestamp || new Date().toISOString(),
    symbol: raw.symbol || 'UNKNOWN',
    action: raw.action || 'UNKNOWN',
    price: typeof raw.price === 'number' ? raw.price : 0,
    confidence: typeof raw.confidence === 'number' ? raw.confidence : 0,
    source: raw.source || 'unknown',
    payload: raw.payload || raw,
  };
}

// ── Kafka consumer ───────────────────────────────────────────────────
const kafka = new Kafka({
  clientId: 'lovable-signals',
  brokers: BROKERS,
  logLevel: logLevel.WARN,
  retry: { initialRetryTime: 1000, retries: 20 },
});

const consumer = kafka.consumer({ groupId: GROUP_ID });

async function startConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC, fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const raw = JSON.parse(message.value.toString());
          const signal = normalize(raw);
          signals.unshift(signal);
          if (signals.length > MAX_SIGNALS) signals.length = MAX_SIGNALS;
          console.log(`[signal] ${signal.symbol} ${signal.action} $${signal.price}`);
        } catch (err) {
          console.error('[kafka] Failed to parse message:', err.message);
        }
      },
    });
    console.log(`[kafka] Consuming topic: ${TOPIC}`);
  } catch (err) {
    console.error('[kafka] Consumer error, retrying in 5s...', err.message);
    setTimeout(startConsumer, 5000);
  }
}

// ── Static file serving ──────────────────────────────────────────────
const DIST = path.join(__dirname, '..', 'dist');
const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  if (fs.existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
    return true;
  }
  return false;
}

// ── HTTP server ──────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const url = req.url.split('?')[0];

  // API routes
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', signals: signals.length, uptime: process.uptime() }));
  }
  if (url === '/api/signals') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(signals));
  }
  if (url === '/api/signals/latest') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(signals[0] || null));
  }

  // Static files (production)
  if (fs.existsSync(DIST)) {
    const filePath = path.join(DIST, url === '/' ? 'index.html' : url);
    if (serveStatic(res, filePath)) return;
    // SPA fallback
    if (serveStatic(res, path.join(DIST, 'index.html'))) return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`[server] Listening on http://0.0.0.0:${PORT}`);
  startConsumer();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[server] Shutting down...');
  await consumer.disconnect();
  server.close(() => process.exit(0));
});
