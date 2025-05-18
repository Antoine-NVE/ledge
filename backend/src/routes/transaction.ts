import express from 'express';
import TransactionController from '../controllers/transaction';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/', authenticate, TransactionController.create);
router.get('/', TransactionController.getAll);
router.get('/:id', TransactionController.getById);
router.put('/:id', TransactionController.update);
router.delete('/:id', TransactionController.remove);

export default router;
