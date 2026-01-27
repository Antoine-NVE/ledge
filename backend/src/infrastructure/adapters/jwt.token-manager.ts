import jwt from 'jsonwebtoken';
import z from 'zod';
import type { TokenManager } from '../../domain/ports/token-manager.js';
import type { IdManager } from '../../domain/ports/id-manager.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';

export class JwtTokenManager implements TokenManager {
    constructor(
        private idManager: IdManager,
        private secret: string,
    ) {}

    signAccess = ({ userId }: { userId: string }): string => {
        return jwt.sign({ sub: userId }, this.secret, { audience: 'access', expiresIn: '15 minutes' });
    };

    verifyAccess = (accessToken: string): Result<{ userId: string }, { type: 'INVALID_TOKEN' }> => {
        const schema = z.object({ sub: z.string().refine((value) => this.idManager.validate(value)) });

        try {
            const { sub } = schema.parse(jwt.verify(accessToken, this.secret, { audience: 'access' }));

            return ok({ userId: sub });
        } catch {
            return fail({ type: 'INVALID_TOKEN' });
        }
    };

    signEmailVerification = ({ userId }: { userId: string }): string => {
        return jwt.sign({ sub: userId }, this.secret, { audience: 'email-verification', expiresIn: '1 hour' });
    };

    verifyEmailVerification = (
        emailVerificationToken: string,
    ): Result<{ userId: string }, { type: 'INVALID_TOKEN' }> => {
        const schema = z.object({ sub: z.string().refine((value) => this.idManager.validate(value)) });

        try {
            const { sub } = schema.parse(
                jwt.verify(emailVerificationToken, this.secret, { audience: 'email-verification' }),
            );

            return ok({ userId: sub });
        } catch {
            return fail({ type: 'INVALID_TOKEN' });
        }
    };
}
