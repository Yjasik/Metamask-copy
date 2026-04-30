// backend/src/controllers/account.controller.ts

import { Response, NextFunction } from 'express';
import Account from '../models/account.model';
import { AuthRequest } from '../middleware/auth';

// GET /api/accounts
export async function getAccounts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const accounts = await Account.find({ userId: req.userId }).select('-encryptedPrivateKey -iv -salt');
    res.json(accounts);
  } catch (error) {
    next(error);
  }
}

// POST /api/accounts
export async function createAccount(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { address, encryptedPrivateKey, iv, salt, chainId } = req.body;
    if (!address || !encryptedPrivateKey || !iv || !salt || !chainId) {
      res.status(400).json({ error: 'Все поля обязательны' });
      return;
    }

    const exists = await Account.findOne({
      userId: req.userId,
      address: address.toLowerCase(),
      chainId,
    });
    if (exists) {
      res.status(409).json({ error: 'Аккаунт с таким адресом уже сохранён' });
      return;
    }

    const account = new Account({
      userId: req.userId,
      address: address.toLowerCase(),
      encryptedPrivateKey,
      iv,
      salt,
      chainId,
    });
    await account.save();
    res.status(201).json({ message: 'Аккаунт сохранён', accountId: account._id });
  } catch (error) {
    next(error);
  }
}

// PUT /api/accounts/:id
export async function updateAccount(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { address, encryptedPrivateKey, iv, salt, chainId } = req.body;

    const account = await Account.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { address, encryptedPrivateKey, iv, salt, chainId },
      { new: true }
    );

    if (!account) {
      res.status(404).json({ error: 'Аккаунт не найден' });
      return;
    }
    res.json({ message: 'Аккаунт обновлён' });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/accounts/:id
export async function deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const account = await Account.findOneAndDelete({ _id: id, userId: req.userId });
    if (!account) {
      res.status(404).json({ error: 'Аккаунт не найден' });
      return;
    }
    res.json({ message: 'Аккаунт удалён' });
  } catch (error) {
    next(error);
  }
}