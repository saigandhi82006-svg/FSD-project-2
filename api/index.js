import dotenv from 'dotenv';
dotenv.config();

import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

export default async function handler(req, res) {
  // Ensure req.url has /api prefix for Express routing if stripped by Vercel rewrites
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('[Database Connect Error in Serverless Handler]:', err);
  }

  return app(req, res);
}
