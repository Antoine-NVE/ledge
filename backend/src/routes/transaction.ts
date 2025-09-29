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

router.post('/', authenticate, (req, res) => transactionController.create(req, res));
router.get('/', authenticate, (req, res) => transactionController.findAll(req, res));
router.get('/:id', authenticate, authorizeTransactionAccess, (req, res) => transactionController.findOne(req, res));
router.put('/:id', authenticate, authorizeTransactionAccess, (req, res) => transactionController.update(req, res));
router.delete('/:id', authenticate, authorizeTransactionAccess, (req, res) => transactionController.remove(req, res));

export default router;
