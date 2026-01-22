import type { TokenManager } from '../../../domain/ports/token-manager.js';
import { findAccessToken } from './auth-cookies.js';
import { AuthenticationError } from '../../../application/errors/authentication.error.js';
import type { Request } from 'express';

export const getAuthenticatedUserId = (req: Request, tokenManager: TokenManager): string => {
    const accessToken = findAccessToken(req);
    if (!accessToken) throw new AuthenticationError();

    return tokenManager.verifyAccess(accessToken).userId;
};
