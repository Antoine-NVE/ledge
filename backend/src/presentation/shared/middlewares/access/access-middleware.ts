import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../../../domain/user/user-service';
import { TransactionService } from '../../../../domain/transaction/transaction-service';
import { UnauthorizedError } from '../../../../infrastructure/errors/unauthorized-error';
import { InternalServerError } from '../../../../infrastructure/errors/internal-server-error';
import { ForbiddenError } from '../../../../infrastructure/errors/forbidden-error';
import { User } from '../../../../domain/user/user-types';
import { Transaction } from '../../../../domain/transaction/transaction-types';
import { authorizeParamsSchema } from './access-schemas';
import { JwtService } from '../../../../infrastructure/services/jwt-service';
import { CookieService } from '../../../../infrastructure/services/cookie-service';
import { parseSchema } from '../../../../infrastructure/utils/schema-utils';

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
        transaction?: Transaction;
    }
}

export class AccessMiddleware {
    constructor(
        private userService: UserService,
        private transactionService: TransactionService,
        private jwtService: JwtService,
    ) {}

    authenticate = async (req: Request, res: Response, next: NextFunction) => {
        const cookieService = new CookieService(req, res);
        const accessToken = cookieService.getAccessToken();
        if (!accessToken)
            throw new UnauthorizedError('Required access token', undefined, {
                action: 'refresh',
            });

        const { sub } = this.jwtService.verifyAccess(accessToken);
        const user = await this.userService.findOneById(sub);

        req.user = user;
        next();
    };

    authorize = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) throw new InternalServerError('Undefined user');

        const { id } = parseSchema(authorizeParamsSchema, req.params);
        const transaction = await this.transactionService.read(id);

        if (!user._id.equals(transaction.userId))
            throw new ForbiddenError('Forbidden access');

        req.transaction = transaction;
        next();
    };
}
