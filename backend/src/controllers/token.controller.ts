// backend/src/controllers/token.controller.ts

import { Response, NextFunction } from 'express';
import Token from '../models/token.model';
import { AuthRequest } from '../middleware/auth';

// GET /api/tokens
export async function getTokens(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const tokens = await Token.find({ userId: req.userId });
    res.json(tokens);
  } catch (error) {
    next(error);
  }
}

// POST /api/tokens
export async function addToken(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { contractAddress, symbol, name, decimals, chainId } = req.body;
    if (!contractAddress || !symbol || !name || decimals == null || !chainId) {
      res.status(400).json({ error: 'Все поля обязательны' });
      return;
    }

    // Проверка на дубликат (индекс сам не даст сохранить, но лучше явно)
    const exists = await Token.findOne({
      userId: req.userId,
      contractAddress: contractAddress.toLowerCase(),
      chainId,
    });
    if (exists) {
      res.status(409).json({ error: 'Токен уже добавлен' });
      return;
    }

    const token = new Token({
      userId: req.userId,
      contractAddress: contractAddress.toLowerCase(),
      symbol: symbol.toUpperCase(),
      name,
      decimals,
      chainId,
    });
    await token.save();
    res.status(201).json(token);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/tokens/:contractAddress
export async function removeToken(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const contractAddress = req.params.contractAddress as string;
    const chainId = req.query.chainId as string;
    if (!chainId) {
      res.status(400).json({ error: 'chainId обязателен' });
      return;
    }
    const deleted = await Token.findOneAndDelete({
      userId: req.userId,
      contractAddress: contractAddress.toLowerCase(),
      chainId: Number(chainId),
    });
    if (!deleted) {
      res.status(404).json({ error: 'Токен не найден' });
      return;
    }
    res.json({ message: 'Токен удалён' });
  } catch (error) {
    next(error);
  }
}