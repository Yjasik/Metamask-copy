import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn('⚠️  MONGO_URI is not set in .env. Server will start without a database connection.');
}

async function start() {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  // Start HTTP server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
  });

  // Graceful shutdown on signals
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received signal ${signal}. Shutting down...`);
    server.close(async () => {
      if (MONGO_URI) {
        await mongoose.connection.close(false);
        console.log('🔌 MongoDB connection closed');
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});