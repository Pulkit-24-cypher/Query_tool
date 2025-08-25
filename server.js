import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for network access
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection - you'll need to update this path
const DB_PATH = path.join(__dirname, 'Investment_Incetive.db');

console.log('Looking for database at:', DB_PATH);
console.log('Database exists:', fs.existsSync(DB_PATH));

// Initialize database connection
let db;
try {
  if (fs.existsSync(DB_PATH)) {
    db = new Database(DB_PATH);
    console.log('✅ Connected to SQLite database at:', DB_PATH);
  } else {
    console.error('❌ Database file not found at:', DB_PATH);
    console.log('📁 Current directory contents:');
    const files = fs.readdirSync(__dirname);
    files.forEach(file => {
      console.log(`   ${file}`);
    });
    console.log('Please ensure Investment_Incetive.db is in the same directory as server.js');
  }
} catch (error) {
  console.error('Database connection failed:', error);
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is running',
    database: db ? 'Connected' : 'Not connected',
    dbPath: DB_PATH
  });
});

// Execute SQL query
app.post('/api/query', (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database not connected. Please ensure Investment_Incetive.db is in the same directory as server.js' 
      });
    }

    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required and must be a string' });
    }

    // Basic security check - only allow SELECT statements
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery.startsWith('select')) {
      return res.status(400).json({ error: 'Only SELECT queries are allowed' });
    }

    const stmt = db.prepare(query);
    const results = stmt.all();
    
    res.json({
      success: true,
      data: results,
      rowCount: results.length,
      query: query
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get table schema
app.get('/api/tables', (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database not connected' 
      });
    }

    const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table'");
    const tables = stmt.all();
    
    res.json({
      success: true,
      tables: tables.map(t => t.name)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get table structure
app.get('/api/tables/:tableName/schema', (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database not connected' 
      });
    }

    const { tableName } = req.params;
    const stmt = db.prepare(`PRAGMA table_info(${tableName})`);
    const schema = stmt.all();
    
    res.json({
      success: true,
      table: tableName,
      schema: schema
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get sample data from a table
app.get('/api/tables/:tableName/sample', (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database not connected' 
      });
    }

    const { tableName } = req.params;
    const limit = req.query.limit || 10;
    
    const stmt = db.prepare(`SELECT * FROM ${tableName} LIMIT ?`);
    const results = stmt.all(limit);
    
    res.json({
      success: true,
      table: tableName,
      data: results,
      rowCount: results.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
