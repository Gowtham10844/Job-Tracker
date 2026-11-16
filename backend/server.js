// server.js - JobTrack Backend Application Server
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// Import Routes
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import dashboardRoutes from './routes/dashboard.js';
import userRoutes from './routes/users.js';
import interviewRoutes from './routes/interviews.js';
import jobRoutes from './routes/jobs.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'https://job-tracker-dusky.vercel.app',
  'https://jobtrack.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      // In development or if origin matches, allow
      if (
        process.env.NODE_ENV !== 'production' ||
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for academic demonstration
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/jobs', jobRoutes); // Backward compatibility

// API Health check & Discovery route
const apiStatusHandler = (req, res) => {
  res.json({
    status: 'ok',
    name: 'JobTrack – Job Application Tracker API',
    version: '2.0.1',
    developer: 'Gowtham10844',
    environment: process.env.NODE_ENV || 'development',
    database:
      mongoose.connection.readyState === 1 ? 'Connected (MongoDB)' : 'In-Memory / Fast Fallback',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      applications: [
        'GET /api/applications',
        'POST /api/applications',
        'GET /api/applications/:id',
        'PUT /api/applications/:id',
        'DELETE /api/applications/:id',
      ],
      dashboard: ['GET /api/dashboard/stats'],
      users: ['GET /api/users/profile', 'PUT /api/users/profile'],
      interviews: ['GET /api/interviews'],
    },
  });
};

app.get('/api', apiStatusHandler);
app.get('/api/health', apiStatusHandler);

// Serve frontend static build if available (supports unified single-platform deployment on Render)
const currentDir = path.resolve();
const possibleStaticDirs = [
  path.join(currentDir, 'frontend/dist'),
  path.join(currentDir, '../frontend/dist'),
  path.join(currentDir, 'dist'),
];

const staticDir = possibleStaticDirs.find(p => fs.existsSync(path.join(p, 'index.html')));

if (staticDir) {
  console.log(`📦 Serving compiled frontend from ${staticDir}`);
  app.use(express.static(staticDir));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(staticDir, 'index.html'));
  });
} else {
  // Health check / Welcome route when running in API-only mode
  app.get('/', apiStatusHandler);
}

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Database connection & Server initialization
const MONGODB_URI = process.env.MONGODB_URI;

// Start HTTP server immediately so Render health-checks and spin-ups respond instantly
// (skip when running automated test runner which binds its own dedicated port)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 JobTrack Backend running on http://localhost:${PORT}`);
    console.log(`📄 API Documentation available at http://localhost:${PORT}/`);
  });
}

// Connect to MongoDB asynchronously if configured or in local development
if (MONGODB_URI || process.env.NODE_ENV !== 'production') {
  const uri = MONGODB_URI || 'mongodb://127.0.0.1:27017/jobtrack';
  console.log('Attempting MongoDB connection...');
  mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log('✅ MongoDB connected successfully to database');
    })
    .catch(err => {
      console.warn('⚠️  MongoDB connection notice:', err.message);
      console.warn('👉 Note: Operating with fast in-memory dual-mode store for reliable academic demo.');
    });
} else {
  console.log('ℹ️  No external MONGODB_URI configured. Running with high-performance in-memory demo data.');
}

export default app;
