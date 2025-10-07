import { NextFunction, Request, Response } from 'express';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from '../services/JwtService';
import { AuthCookieService } from '../services/AuthCookieService';
import { RequiredAccessTokenError } from '../errors/UnauthorizedError';
import { ObjectId } from 'mongodb';
import { TransactionNotFoundError, UserNotFoundError } from '../errors/NotFoundError';
import { User } from '../types/userType';
import { UndefinedUserError } from '../errors/InternalServerError';
import { TransactionAccessForbiddenError } from '../errors/ForbiddenError';
import { Transaction } from '../types/transactionType';

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
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private transactionRepository: TransactionRepository,
    ) {}

    authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
        const authCookieService = new AuthCookieService(req, res);
        const accessToken = authCookieService.getAccessTokenCookie();
        if (!accessToken) throw new RequiredAccessTokenError();

        const payload = this.jwtService.verifyAccessJwt(accessToken);
        const user = await this.userRepository.findOneById(new ObjectId(payload.sub));
        if (!user) throw new UserNotFoundError();

        req.user = user;
        next();
    };

    authorizeTransaction = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const transactionId = new ObjectId(req.params.id);

        const transaction = await this.transactionRepository.findOneById(transactionId);
        if (!transaction) throw new TransactionNotFoundError();

        if (!user._id.equals(transaction.userId)) throw new TransactionAccessForbiddenError();

        req.transaction = transaction;
        next();
    };
}
