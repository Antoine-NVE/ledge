import express from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { db } from '../config/db';
import { SecurityMiddleware } from '../middlewares/SecurityMiddleware';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from '../services/JwtService';
import { env } from '../config/env';

const router = express.Router();

const transactionRepository = new TransactionRepository(db.collection('transactions'));
const transactionController = new TransactionController(transactionRepository);
const userRepository = new UserRepository(db.collection('users'));
const jwtService = new JwtService(env.JWT_SECRET);
const securityMiddleware = new SecurityMiddleware(
    userRepository,
    jwtService,
    transactionRepository,
);

router.post('/', securityMiddleware.authenticateUser, transactionController.create);
router.get('/', securityMiddleware.authenticateUser, transactionController.findAll);
router.get(
    '/:id',
    securityMiddleware.authenticateUser,
    securityMiddleware.authorizeTransaction,
    transactionController.findOne,
);
router.put(
    '/:id',
    securityMiddleware.authenticateUser,
    securityMiddleware.authorizeTransaction,
    transactionController.update,
);
// router.delete('/:id', authenticate, authorizeTransactionAccess, transactionController.remove);

export default router;
