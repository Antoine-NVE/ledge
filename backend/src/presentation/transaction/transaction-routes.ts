import express from 'express';
import { container } from '../../infrastructure/config/container';
import { validateBody } from '../shared/middlewares/validate-body/validate-body-middleware';
import { createBodySchema, updateBodySchema } from './transaction-schemas';
import { authenticate } from '../shared/middlewares/authenticate/authenticate-middleware';
import { authorize } from '../shared/middlewares/authorize/authorize-middleware';
import { authorizeParamsSchema } from '../shared/middlewares/authorize/authorize-schemas';
import { validateParams } from '../shared/middlewares/validate-params/validate-params-middleware';

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
    validateBody(createBodySchema),
    create,
);
router.get('/', authenticate(jwtService, userService), readAll);
router.get(
    '/:id',
    authenticate(jwtService, userService),
    validateParams(authorizeParamsSchema),
    authorize(transactionService),
    read,
);
router.put(
    '/:id',
    authenticate(jwtService, userService),
    validateParams(authorizeParamsSchema),
    authorize(transactionService),
    validateBody(updateBodySchema),
    update,
);
router.delete(
    '/:id',
    authenticate(jwtService, userService),
    validateParams(authorizeParamsSchema),
    authorize(transactionService),
    remove,
);

export default router;
