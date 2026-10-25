import dotenv from 'dotenv';
dotenv.config();

import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

// Serverless DB connection & URL normalization middleware
app.use(async (req, res, next) => {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('[Serverless DB Connect Error]:', err);
  }
  next();
});

export default app;
