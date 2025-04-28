import express from 'express';
import TransactionController from '../controllers/transaction';

const router = express.Router();

router.post('/', TransactionController.create);
router.get('/', TransactionController.getAll);
router.get('/:id', TransactionController.getById);

export default router;
