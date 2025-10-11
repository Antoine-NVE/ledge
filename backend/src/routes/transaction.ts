import express from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { db } from '../config/db';
import { SecurityMiddleware } from '../middlewares/SecurityMiddleware';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from '../services/JwtService';
import { env } from '../config/env';
import { EmailService } from '../services/EmailService';
import { UserService } from '../services/UserService';
import { TransactionService } from '../services/TransactionService';
import { container } from '../config/container';

const router = express.Router();

const { authenticateUser, authorizeTransaction } = container.securityMiddleware;
const { create, readMany, read, update, delete: remove } = container.transactionController;

router.post('/', authenticateUser, create);
router.get('/', authenticateUser, readMany);
router.get('/:id', authenticateUser, authorizeTransaction, read);
router.put('/:id', authenticateUser, authorizeTransaction, update);
router.delete('/:id', authenticateUser, authorizeTransaction, remove);

export default router;
