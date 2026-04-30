// backend/src/app.ts

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Импорт роутеров (будут созданы позже, пока закомментированы)
import userRoutes from './routes/user.routes';
import accountRoutes from './routes/account.routes';
import tokenRoutes from './routes/token.routes';

const app: Application = express();

// ---------- Middleware ----------
app.use(cors({
  origin: '*', // в будущем замените на конкретный источник расширения
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Логирование запросов (простой пример)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ---------- Базовый маршрут для проверки ----------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------- Подключение роутеров ----------
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/tokens', tokenRoutes);

// ---------- Обработчик 404 ----------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// ---------- Глобальный обработчик ошибок ----------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;