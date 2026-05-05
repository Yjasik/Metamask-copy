import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '../controllers/account.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getAccounts);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;