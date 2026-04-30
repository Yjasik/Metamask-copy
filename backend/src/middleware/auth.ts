// backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Расширяем тип Request, чтобы поместить userId
export interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Не предоставлен токен авторизации' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-access-secret'
    ) as { userId: string };

    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Недействительный или истёкший токен' });
  }
};

export default authMiddleware;