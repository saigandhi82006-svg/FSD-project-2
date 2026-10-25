import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;
let connectionError = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    connectionError = 'MONGODB_URI is not defined in environment variables. Please configure your MongoDB Atlas connection string in .env file.';
    console.error('\n======================================================');
    console.error('⚠️  DATABASE CONFIGURATION WARNING:');
    console.error('   MONGODB_URI environment variable is missing.');
    console.error('   To configure MongoDB Atlas:');
    console.error('   1. Create a free cluster at https://www.mongodb.com/cloud/atlas');
    console.error('   2. Create database user credentials & allow network access (0.0.0.0/0)');
    console.error('   3. Add MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/alumni_directory?retryWrites=true&w=majority to your .env file');
    console.error('======================================================\n');
    return false;
  }

  // Reuse existing connection if already active (serverless optimization)
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    connectionError = null;
    return true;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    connectionError = null;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    connectionError = error.message;
    console.error('\n======================================================');
    console.error('❌ MONGODB CONNECTION FAILED:');
    console.error(`   Error: ${error.message}`);
    console.error('   Actionable Steps:');
    console.error('   1. Verify your network/IP whitelist in MongoDB Atlas Security settings.');
    console.error('   2. Verify username, password, and cluster address in MONGODB_URI.');
    console.error('   3. If using local MongoDB, ensure "mongod" service is running.');
    console.error('======================================================\n');
    return false;
  }
};

export const getDbStatus = () => {
  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    error: connectionError,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null
  };
};

export default connectDB;
