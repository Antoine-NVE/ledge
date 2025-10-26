import express from 'express';
import { container } from '../../config/container';

const router = express.Router();

const { authenticate, authorize } = container.accessMiddleware;
const {
    create,
    readAll,
    read,
    update,
    delete: remove,
} = container.transactionController;

router.post('/', authenticate, create);
router.get('/', authenticate, readAll);
router.get('/:id', authenticate, authorize, read);
router.put('/:id', authenticate, authorize, update);
router.delete('/:id', authenticate, authorize, remove);

export default router;
