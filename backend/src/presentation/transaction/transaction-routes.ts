import express from 'express';
import { container } from '../../infrastructure/config/container-config';
import { validate } from '../shared/middlewares/validate/validate-middleware';
import { createBodySchema, updateBodySchema } from './transaction-schemas';
import { authenticate } from '../shared/middlewares/authenticate/authenticate-middleware';
import { authorize } from '../shared/middlewares/authorize/authorize-middleware';

const router = express.Router();

const { jwtService, userService, transactionService } = container;
const {
    create,
    readAll,
    read,
    update,
    delete: remove,
} = container.transactionController;

router.post(
    '/',
    authenticate(jwtService, userService),
    validate(createBodySchema),
    create,
);
router.get('/', authenticate(jwtService, userService), readAll);
router.get(
    '/:id',
    authenticate(jwtService, userService),
    authorize(transactionService),
    read,
);
router.put(
    '/:id',
    authenticate(jwtService, userService),
    authorize(transactionService),
    validate(updateBodySchema),
    update,
);
router.delete(
    '/:id',
    authenticate(jwtService, userService),
    authorize(transactionService),
    remove,
);

export default router;
