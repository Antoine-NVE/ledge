import { NextFunction, Request, Response } from 'express';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from '../services/JwtService';
import { CookieService } from '../services/CookieService';
import { RequiredAccessTokenError } from '../errors/UnauthorizedError';
import { ObjectId } from 'mongodb';
import { TransactionNotFoundError, UserNotFoundError } from '../errors/NotFoundError';
import { User } from '../types/User';
import { UndefinedUserError } from '../errors/InternalServerError';
import { TransactionAccessForbiddenError } from '../errors/ForbiddenError';
import { Transaction } from '../types/Transaction';
import { UserService } from '../services/UserService';
import { TransactionService } from '../services/TransactionService';
import { UserSchema } from '../schemas/UserSchema';
import { TransactionSchema } from '../schemas/TransactionSchema';
import { SecuritySchema } from '../schemas/SecuritySchema';

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
        private securitySchema: SecuritySchema,
    ) {}

    authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
        const cookieService = new CookieService(req, res);
        const accessToken = cookieService.getAccessToken();
        if (!accessToken) throw new RequiredAccessTokenError('refresh');

        const payload = this.jwtService.verifyAccess(accessToken);
        const { userId } = this.securitySchema.authenticate.parse({ userId: payload.sub });
        const user = await this.userService.findOneById(userId);

        req.user = user;
        next();
    };

    authorizeTransaction = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const { transactionId } = this.securitySchema.authorize.parse({
            transactionId: req.params.id,
        });

        const transaction = await this.transactionService.findOneById(transactionId);

        if (!user._id.equals(transaction.userId)) throw new TransactionAccessForbiddenError();

        req.transaction = transaction;
        next();
    };
}
