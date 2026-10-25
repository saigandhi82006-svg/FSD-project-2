import dotenv from 'dotenv';
dotenv.config();

import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

let dbInitialized = false;

export default async function handler(req, res) {
  if (!dbInitialized) {
    try {
      await connectDB();
      dbInitialized = true;
    } catch (err) {
      console.error('[Database Connect Error in Serverless Handler]:', err);
    }
  }

  return app(req, res);
}
