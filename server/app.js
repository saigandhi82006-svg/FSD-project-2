import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import alumniRoutes from './routes/alumniRoutes.js';
import mentorshipRoutes from './routes/mentorshipRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB, getDbStatus } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false // Allows Vite HMR & local image rendering
  })
);

// CORS configuration with credentials support
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local testing while maintaining credentials
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.resolve(process.cwd(), 'public', 'uploads')));

// Health & Database status endpoint
app.get(['/api/health', '/health'], async (req, res) => {
  await connectDB();
  const dbStatus = getDbStatus();
  res.status(200).json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Alumni Network Directory API',
    database: dbStatus
  });
});

// Database availability check for API endpoints
app.use(['/api', '/'], async (req, res, next) => {
  // Allow health endpoint
  if (req.path === '/health' || req.path === '/api/health') return next();

  await connectDB();
  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({
      success: false,
      error: dbStatus.error || 'MongoDB database is not connected. Please configure MONGODB_URI in your .env file.',
      code: 'DB_DISCONNECTED',
      actionableSteps: [
        '1. Create a free cluster at https://www.mongodb.com/cloud/atlas',
        '2. Add IP 0.0.0.0/0 to Atlas Network Access',
        '3. Configure MONGODB_URI in your Vercel Environment Variables',
        '4. Redeploy the application'
      ]
    });
  }
  next();
});

// Mount modular REST routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Catch-all for undefined API endpoints
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
