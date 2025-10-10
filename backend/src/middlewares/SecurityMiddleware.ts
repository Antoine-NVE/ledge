import { NextFunction, Request, Response } from 'express';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from '../services/JwtService';
import { CookieService } from '../services/CookieService';
import { RequiredAccessTokenError } from '../errors/UnauthorizedError';
import { ObjectId } from 'mongodb';
import { TransactionNotFoundError, UserNotFoundError } from '../errors/NotFoundError';
import { User } from '../types/userType';
import { UndefinedUserError } from '../errors/InternalServerError';
import { TransactionAccessForbiddenError } from '../errors/ForbiddenError';
import { Transaction } from '../types/transactionType';
import { UserService } from '../services/UserService';
import { TransactionService } from '../services/TransactionService';
import { authorizeTransactionInputSchema } from '../schemas/transactionSchema';
import { authenticateUserInputSchema } from '../schemas/userSchema';

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}

declare module 'express-serve-static-core' {
    interface Request {
        transaction?: Transaction;
    }
}

export class SecurityMiddleware {
    constructor(
        private userService: UserService,
        private transactionService: TransactionService,
        private jwtService: JwtService,
    ) {}

    authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
        const cookieService = new CookieService(req, res);
        const accessToken = cookieService.getAccessTokenCookie();
        if (!accessToken) throw new RequiredAccessTokenError();

        const payload = this.jwtService.verifyAccessJwt(accessToken);
        const { userId } = authenticateUserInputSchema.parse({ userId: payload.sub });
        const user = await this.userService.findOneById(userId);
        if (!user) throw new UserNotFoundError();

        req.user = user;
        next();
    };

    authorizeTransaction = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const { transactionId } = authorizeTransactionInputSchema.parse(req.params.id);

        const transaction = await this.transactionService.findOneById(transactionId);
        if (!transaction) throw new TransactionNotFoundError();

        if (!user._id.equals(transaction.userId)) throw new TransactionAccessForbiddenError();

        req.transaction = transaction;
        next();
    };
}
