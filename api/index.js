import dotenv from 'dotenv';
dotenv.config();

import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Database Connect Error in Serverless Handler]:', err);
  }

  return app(req, res);
}
