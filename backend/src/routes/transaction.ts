import express from 'express';
import authenticate from '../middlewares/authenticate';
import {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    removeTransaction,
    updateTransaction,
} from '../controllers/transaction';
import authorizeTransactionAccess from '../middlewares/authorizeTransactionAccess';

const router = express.Router();

router.post('/', authenticate, createTransaction);
router.get('/', authenticate, getAllTransactions);
router.get('/:id', authenticate, authorizeTransactionAccess, getTransactionById);
router.put('/:id', authenticate, authorizeTransactionAccess, updateTransaction);
router.delete('/:id', authenticate, authorizeTransactionAccess, removeTransaction);

export default router;
