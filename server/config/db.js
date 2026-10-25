import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

let connectionError = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    connectionError = 'MONGODB_URI is not defined in environment variables. Please configure your MongoDB Atlas connection string in .env file.';
    console.error('\n======================================================');
    console.error('⚠️  DATABASE CONFIGURATION WARNING:');
    console.error('   MONGODB_URI environment variable is missing.');
    console.error('======================================================\n');
    return false;
  }

  // Reuse existing connection if already open (serverless optimization)
  if (mongoose.connection.readyState === 1) {
    connectionError = null;
    return true;
  }

  // If connection is currently in progress, wait for the existing promise to resolve
  if (cached.promise && mongoose.connection.readyState === 2) {
    try {
      await cached.promise;
      connectionError = null;
      return mongoose.connection.readyState === 1;
    } catch {
      cached.promise = null;
    }
  }

  try {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    const conn = await cached.promise;
    cached.conn = conn;
    connectionError = null;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);
    return true;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    connectionError = error.message;
    console.error('\n======================================================');
    console.error('❌ MONGODB CONNECTION FAILED:');
    console.error(`   Error: ${error.message}`);
    console.error('======================================================\n');
    return false;
  }
};

export const getDbStatus = () => {
  const readyState = mongoose.connection.readyState;
  // readyState 1 = connected, 2 = connecting
  const isHealthy = readyState === 1 || readyState === 2;
  return {
    connected: isHealthy,
    readyState,
    error: connectionError,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null
  };
};

export default connectDB;
