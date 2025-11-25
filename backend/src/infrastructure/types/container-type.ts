import { AuthController } from '../../presentation/auth/auth-controller';
import { UserController } from '../../presentation/user/user-controller';
import { TransactionController } from '../../presentation/transaction/transaction-controller';
import { NextFunction, Request, Response } from 'express';
import { AuthorizeParams } from '../../presentation/shared/middlewares/authorize/authorize-types';

export type Container = {
    authController: AuthController;
    userController: UserController;
    transactionController: TransactionController;
    authenticate: (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => Promise<void>;
    authorize: (
        req: Request<AuthorizeParams>,
        res: Response,
        next: NextFunction,
    ) => Promise<void>;
};
