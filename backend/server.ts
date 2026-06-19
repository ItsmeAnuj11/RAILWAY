import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define MongoDB Schemas
const userSearchSchema = new mongoose.Schema({
  featureName: String,
  searchQuery: String,
  createdAt: { type: Date, default: Date.now }
});
const UserSearch = mongoose.model('UserSearch', userSearchSchema);

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fullName: String,
  email: { type: String, unique: true },
  phone: String,
  password: { type: String, required: true },
  role: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const complaintSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userName: String,
  userEmail: String,
  phone: String,
  pnr: String,
  type: String,
  description: String,
  status: String,
  adminFeedback: String,
  createdAt: { type: Date, default: Date.now }
});
const Complaint = mongoose.model('Complaint', complaintSchema);

async function initDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is missing from your .env file.');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
}

async function startServer() {
  try {
    await initDB();
  } catch (error) {
    console.error('Failed to connect to MongoDB. Ensure your MONGO_URI in .env is correct.', error);
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
      await UserSearch.create({ featureName, searchQuery });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const { id, fullName, email, phone, password, role } = req.body;
      await User.create({ id, fullName, email, phone, password, role });
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
      await Complaint.create({ id, userName, userEmail, phone, pnr, type, description, status, adminFeedback: '' });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/complaints', async (req, res) => {
    try {
      const complaints = await Complaint.find().sort({ createdAt: -1 });
      res.json(complaints);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.patch('/api/complaints/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminFeedback } = req.body;
      
      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (adminFeedback !== undefined) updateData.adminFeedback = adminFeedback;
      
      await Complaint.updateOne({ id }, { $set: updateData });
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
