import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Parse JSON bodies (needed for POST /api/query)
app.use(express.json());

// ✅ CORS: allow same-origin in prod, broader only for dev/testing
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      /\.ngrok-free\.app$/,
      /\.railway\.app$/
    ];
    if (!origin) return cb(null, true); // curl / server-to-server
    if (allowed.some(p => (p.test ? p.test(origin) : p === origin))) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'ngrok-skip-browser-warning']
}));

// ==============================
// Database setup
// ==============================
// ✅ Make DB path configurable so you can mount a Railway Volume (e.g., /data)
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'Investment_Incentive.db');
console.log('Looking for database at:', DB_PATH);
console.log('Database exists:', fs.existsSync(DB_PATH));

let db;
try {
  if (fs.existsSync(DB_PATH)) {
    db = new Database(DB_PATH);
    console.log('✅ Connected to SQLite database at:', DB_PATH);
  } else {
    console.error('❌ Database file not found at:', DB_PATH);
  }
} catch (error) {
  console.error('Database connection failed:', error);
}

// ==============================
// API routes
// ==============================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: db ? 'Connected' : 'Not connected', dbPath: DB_PATH });
});

app.post('/api/query', (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, error: 'Database not connected' });
    const { query } = req.body;
    if (!query || typeof query !== 'string') return res.status(400).json({ error: 'Query is required and must be a string' });
    const trimmed = query.trim().toLowerCase();
    if (!trimmed.startsWith('select')) return res.status(400).json({ error: 'Only SELECT queries are allowed' });

    const stmt = db.prepare(query);
    const results = stmt.all();
    res.json({ success: true, data: results, rowCount: results.length, query });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tables', (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, error: 'Database not connected' });
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    res.json({ success: true, tables: tables.map(t => t.name) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tables/:tableName/schema', (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, error: 'Database not connected' });
    const { tableName } = req.params;
    const stmt = db.prepare(`PRAGMA table_info(${tableName})`);
//                      ↑ Add backticks here            ↑
    res.json({ success: true, table: tableName, schema });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tables/:tableName/sample', (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, error: 'Database not connected' });
    const { tableName } = req.params;
    const limit = Number(req.query.limit) || 10;
    const stmt = db.prepare(`SELECT * FROM ${tableName} LIMIT ?`);
    res.json({ success: true, table: tableName, data: results, rowCount: results.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==============================
// Static frontend (Vite build)
// ==============================
// ✅ Serve React build from /dist
const distPath = path.join(__dirname, 'dist');
const distPath = path.join(_dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

// ✅ Listen on all interfaces (Railway)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
