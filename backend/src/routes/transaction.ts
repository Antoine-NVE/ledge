import express from 'express';
import { authenticate } from '../middlewares/authenticate';
import authorizeTransactionAccess from '../middlewares/authorizeTransactionAccess';
import { TransactionController } from '../controllers/TransactionController';
import { TransactionService } from '../services/TransactionService';
import { TransactionRepository } from '../repositories/TransactionRepository';
import TransactionModel from '../models/Transaction';

const router = express.Router();

const transactionController = new TransactionController(
    new TransactionService(new TransactionRepository(TransactionModel)),
);

router.post('/', authenticate, transactionController.create);
router.get('/', authenticate, transactionController.findAll);
router.get('/:id', authenticate, authorizeTransactionAccess, transactionController.findOne);
router.put('/:id', authenticate, authorizeTransactionAccess, transactionController.update);
router.delete('/:id', authenticate, authorizeTransactionAccess, transactionController.remove);

export default router;
