import { NextFunction, Request, Response } from 'express';
import { JwtService } from '../services/jwt-service';
import { CookieService } from '../services/cookie-service';
import { UserService } from '../services/user-service';
import { TransactionService } from '../services/transaction-service';
import { parseSchema } from '../utils/schema-utils';
import { objectIdSchema } from '../schemas/security-schemas';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { InternalServerError } from '../errors/internal-server-error';
import { ForbiddenError } from '../errors/forbidden-error';
import { User } from '../entities/user/user-types';
import { Transaction } from '../entities/transaction/transaction-types';

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
        transaction?: Transaction;
    }
}

export class SecurityMiddleware {
    constructor(
        private userService: UserService,
        private transactionService: TransactionService,
        private jwtService: JwtService,
    ) {}

    authenticateUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const cookieService = new CookieService(req, res);
        const accessToken = cookieService.getAccessToken();
        if (!accessToken)
            throw new UnauthorizedError('Required access token', undefined, {
                action: 'refresh',
            });

        const payload = this.jwtService.verifyAccess(accessToken);
        const userId = parseSchema(objectIdSchema, payload.sub);
        const user = await this.userService.findOneById(userId);

        req.user = user;
        next();
    };

    authorizeTransaction = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const user = req.user;
        if (!user) throw new InternalServerError('Undefined user');

        const transactionId = parseSchema(objectIdSchema, req.params.id);
        const transaction =
            await this.transactionService.findOneById(transactionId);

        if (!user._id.equals(transaction.userId))
            throw new ForbiddenError('Forbidden access');

        req.transaction = transaction;
        next();
    };
}
