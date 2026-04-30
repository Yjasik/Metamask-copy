// backend/src/routes/user.routes.ts

import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller';

const router = Router();

// Регистрация нового пользователя
router.post('/register', register);

// Вход в систему
router.post('/login', login);

// Обновление токенов по refresh-токену
router.post('/refresh', refreshToken);

// Выход (инвалидация refresh-токена)
router.post('/logout', logout);

export default router;