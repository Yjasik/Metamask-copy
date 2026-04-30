// backend/src/server.ts

import dotenv from 'dotenv';
dotenv.config(); // загружаем .env до всех импортов

import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn('⚠️  MONGO_URI не задан в .env. Сервер запустится без подключения к базе данных.');
}

async function start() {
  // Подключаемся к MongoDB, если URI предоставлен
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('✅ Подключено к MongoDB');
    } catch (error) {
      console.error('❌ Ошибка подключения к MongoDB:', error);
      process.exit(1);
    }
  }

  // Запускаем HTTP‑сервер
  const server = app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
  });

  // Корректное завершение при сигналах
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Получен сигнал ${signal}. Завершаем работу...`);
    server.close(async () => {
      if (MONGO_URI) {
        await mongoose.connection.close(false);
        console.log('🔌 Соединение с MongoDB закрыто');
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  console.error('Не удалось запустить сервер:', err);
  process.exit(1);
});