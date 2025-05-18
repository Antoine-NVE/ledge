import express from 'express';
import TransactionController from '../controllers/transaction';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/', authenticate, TransactionController.create);
router.get('/', authenticate, TransactionController.getAll);
router.get('/:id', authenticate, TransactionController.getById);
router.put('/:id', authenticate, TransactionController.update);
router.delete('/:id', authenticate, TransactionController.remove);

export default router;
