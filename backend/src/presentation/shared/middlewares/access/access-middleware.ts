import { NextFunction, Request, Response } from 'express';
import { JwtService } from '../../../../services/jwt-service';
import { CookieService } from '../../../../services/cookie-service';
import { UserService } from '../../../../domain/user/user-service';
import { TransactionService } from '../../../../domain/transaction/transaction-service';
import { parseSchema } from '../../../../utils/schema-utils';
import { objectIdSchema } from '../../../../schemas/security-schemas';
import { UnauthorizedError } from '../../../../errors/unauthorized-error';
import { InternalServerError } from '../../../../errors/internal-server-error';
import { ForbiddenError } from '../../../../errors/forbidden-error';
import { User } from '../../../../domain/user/user-types';
import { Transaction } from '../../../../domain/transaction/transaction-types';
import { authorizeParamsSchema } from './access-schemas';

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

        const payload = this.jwtService.verifyAccess(accessToken);
        const userId = parseSchema(objectIdSchema, payload.sub);
        const user = await this.userService.findOneById(userId);

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
