const path = require('path');
const dotenv = require('dotenv');

// Load environment variables explicitly from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { getIsConfigured } = require('./config/supabase');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SprintFlow AI Autonomous Agent Platform',
    timestamp: new Date().toISOString(),
    database: getIsConfigured() ? 'Supabase PostgreSQL' : 'In-Memory Fallback',
    geminiStatus: process.env.GEMINI_API_KEY ? 'Configured' : 'Fallback Engine Ready'
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Server Error]', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ SprintFlow AI Server Running on Port ${PORT}`);
  console.log(`🗄️ Database: ${getIsConfigured() ? 'Supabase PostgreSQL' : 'In-Memory Engine'}`);
  console.log(`🤖 Multi-Agent Orchestrator Ready (Gemini API Enabled)`);
  console.log(`=======================================================`);
});
