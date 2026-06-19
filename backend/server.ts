import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

let pool: mysql.Pool;

async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'railcare';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  // Connect without a database first to ensure it exists
  const connection = await mysql.createConnection({ host, user, password, port });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await connection.end();

  // Create a pool connected to the specified database
  pool = mysql.createPool({
    host,
    user,
    password,
    port,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Initialize tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_searches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      featureName VARCHAR(255),
      searchQuery VARCHAR(255),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      fullName VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      phone VARCHAR(255),
      password VARCHAR(255),
      role VARCHAR(50),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS complaints (
      id VARCHAR(255) PRIMARY KEY,
      userName VARCHAR(255),
      userEmail VARCHAR(255),
      phone VARCHAR(255),
      pnr VARCHAR(255),
      type VARCHAR(255),
      description TEXT,
      status VARCHAR(255),
      adminFeedback TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('MySQL database initialized successfully');
}

async function startServer() {
  try {
    await initDB();
  } catch (error) {
    console.error('Failed to initialize database. Ensure your MySQL credentials in .env are correct and the server is running.', error);
    process.exit(1);
  }

  const app = express();
  const PORT = 3000;
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post('/api/searches', async (req, res) => {
    try {
      const { featureName, searchQuery } = req.body;
      await pool.execute(
        'INSERT INTO user_searches (featureName, searchQuery) VALUES (?, ?)',
        [featureName, searchQuery]
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const { id, fullName, email, phone, password, role } = req.body;
      await pool.execute(
        'INSERT INTO users (id, fullName, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
        [id, fullName, email, phone, password, role]
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      hasApiKey: !!process.env.VITE_GEMINI_API_KEY 
    });
  });

  app.post('/api/complaints', async (req, res) => {
    try {
      const { id, userName, userEmail, phone, pnr, type, description, status } = req.body;
      await pool.execute(
        'INSERT INTO complaints (id, userName, userEmail, phone, pnr, type, description, status, adminFeedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, userName, userEmail, phone, pnr, type, description, status, '']
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/complaints', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM complaints ORDER BY createdAt DESC');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.patch('/api/complaints/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminFeedback } = req.body;
      
      if (status !== undefined && adminFeedback !== undefined) {
        await pool.execute('UPDATE complaints SET status = ?, adminFeedback = ? WHERE id = ?', [status, adminFeedback, id]);
      } else if (status !== undefined) {
        await pool.execute('UPDATE complaints SET status = ? WHERE id = ?', [status, id]);
      } else if (adminFeedback !== undefined) {
        await pool.execute('UPDATE complaints SET adminFeedback = ? WHERE id = ?', [adminFeedback, id]);
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Express API is completely decoupled from the frontend in development.
  // In production, configure NGINX/Render/Vercel to proxy /api to this server.

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
