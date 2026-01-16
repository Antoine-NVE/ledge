import jwt from 'jsonwebtoken';
import z from 'zod';
import type { TokenManager } from '../../application/ports/token-manager.js';
import type { IdManager } from '../../application/ports/id-manager.js';
import { AuthenticationError } from '../../application/errors/authentication.error.js';
import { BusinessRuleError } from '../../application/errors/business-rule.error.js';
import type { StringValue } from 'ms';

export class JwtTokenManager implements TokenManager {
    constructor(
        private idManager: IdManager,
        private secret: string,
    ) {}

    private sign = (payload: { sub: string }, options: { audience: string; expiresIn: StringValue }): string => {
        return jwt.sign(payload, this.secret, options);
    };

    private verify = (
        token: string,
        options: { audience: string },
    ): { sub: string; aud: string; iat: number; exp: number } => {
        const schema = z.object({
            sub: z.string().refine((value) => this.idManager.validate(value)),
            aud: z.string(),
            iat: z.number(),
            exp: z.number(),
        });

        return schema.parse(jwt.verify(token, this.secret, options));
    };

    signAccess = ({ userId }: { userId: string }): string => {
        return this.sign({ sub: userId }, { audience: 'access', expiresIn: '15 minutes' });
    };

    verifyAccess = (accessToken: string): { userId: string } => {
        try {
            const { sub } = this.verify(accessToken, { audience: 'access' });

            return { userId: sub };
        } catch (err: unknown) {
            throw new AuthenticationError({ cause: err });
        }
    };

    signEmailVerification = ({ userId }: { userId: string }): string => {
        return this.sign({ sub: userId }, { audience: 'email-verification', expiresIn: '1 hour' });
    };

    verifyEmailVerification = (emailVerificationToken: string): { userId: string } => {
        try {
            const { sub } = this.verify(emailVerificationToken, { audience: 'email-verification' });

            return { userId: sub };
        } catch (err: unknown) {
            throw new BusinessRuleError({ cause: err });
        }
    };
}
