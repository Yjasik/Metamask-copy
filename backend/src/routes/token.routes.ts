// backend/src/routes/token.routes.ts

import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import { getTokens, addToken, removeToken } from '../controllers/token.controller';

const router = Router();

// Все маршруты защищены
router.use(authMiddleware);

router.get('/', getTokens);
router.post('/', addToken);
router.delete('/:contractAddress', removeToken);

export default router;