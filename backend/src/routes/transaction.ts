import express from 'express';
import authenticate from '../middlewares/authenticate';
import { create, findAll, findOne, remove, update } from '../controllers/TransactionController';
import authorizeTransactionAccess from '../middlewares/authorizeTransactionAccess';

const router = express.Router();

router.post('/', authenticate, create);
router.get('/', authenticate, findAll);
router.get('/:id', authenticate, authorizeTransactionAccess, findOne);
router.put('/:id', authenticate, authorizeTransactionAccess, update);
router.delete('/:id', authenticate, authorizeTransactionAccess, remove);

export default router;
