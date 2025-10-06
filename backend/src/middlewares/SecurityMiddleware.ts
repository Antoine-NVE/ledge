import { NextFunction, Request, Response } from 'express';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from '../services/JwtService';
import { AuthCookieService } from '../services/AuthCookieService';
import { RequiredAccessTokenError } from '../errors/UnauthorizedError';
import { ObjectId } from 'mongodb';
import { UserNotFoundError } from '../errors/NotFoundError';
import { User } from '../types/userType';

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
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
}
