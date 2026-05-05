import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import { getTokens, addToken, removeToken } from '../controllers/token.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getTokens);
router.post('/', addToken);
router.delete('/:contractAddress', removeToken);

export default router;