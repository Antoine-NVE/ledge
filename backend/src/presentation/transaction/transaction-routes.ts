import express from 'express';
import { container } from '../../infrastructure/config/container-config';
import { validate } from '../shared/middlewares/validate/validate-middleware';
import { createBodySchema, updateBodySchema } from './transaction-schemas';

const router = express.Router();

const { authenticate, authorize } = container.accessMiddleware;
const {
    create,
    readAll,
    read,
    update,
    delete: remove,
} = container.transactionController;

router.post('/', authenticate, validate(createBodySchema), create);
router.get('/', authenticate, readAll);
router.get('/:id', authenticate, authorize, read);
router.put('/:id', authenticate, authorize, validate(updateBodySchema), update);
router.delete('/:id', authenticate, authorize, remove);

export default router;
