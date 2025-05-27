import express from 'express';
import authenticate from '../middlewares/authenticate';
import {
    createTransaction,
    getTransactions,
    getTransaction,
    removeTransaction,
    updateTransaction,
} from '../controllers/transaction';
import authorizeTransactionAccess from '../middlewares/authorizeTransactionAccess';

const router = express.Router();

router.post('/', authenticate, createTransaction);
router.get('/', authenticate, getTransactions);
router.get('/:id', authenticate, authorizeTransactionAccess, getTransaction);
router.put('/:id', authenticate, authorizeTransactionAccess, updateTransaction);
router.delete('/:id', authenticate, authorizeTransactionAccess, removeTransaction);

export default router;
