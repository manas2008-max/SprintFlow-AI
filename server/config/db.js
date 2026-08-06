const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/sprintflow_db';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection failed (${error.message}). Operating in high-performance local memory fallback mode for seamless hackathon demo.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
