import express from 'express';
import authenticate from '../middlewares/authenticate';
import {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    removeTransaction,
    updateTransaction,
} from '../controllers/transaction';

const router = express.Router();

router.post('/', authenticate, createTransaction);
router.get('/', authenticate, getAllTransactions);
router.get('/:id', authenticate, getTransactionById);
router.put('/:id', authenticate, updateTransaction);
router.delete('/:id', authenticate, removeTransaction);

export default router;
