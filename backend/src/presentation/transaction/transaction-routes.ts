import express from 'express';
import { container } from '../../config/container';

const router = express.Router();

const { authenticateUser, authorizeTransaction } = container.securityMiddleware;
const {
    create,
    readAll,
    read,
    update,
    delete: remove,
} = container.transactionController;

router.post('/', authenticateUser, create);
router.get('/', authenticateUser, readAll);
router.get('/:id', authenticateUser, authorizeTransaction, read);
router.put('/:id', authenticateUser, authorizeTransaction, update);
router.delete('/:id', authenticateUser, authorizeTransaction, remove);

export default router;
