import type { TokenManager } from '../../../domain/ports/token-manager.js';
import { UnauthorizedError } from '../errors/unauthorized.error.js';

export const authenticateOrThrow = (tokenManager: TokenManager, accessToken?: string) => {
    if (!accessToken) throw new UnauthorizedError();

    const result = tokenManager.verifyAccess(accessToken);
    if (!result.success) throw new UnauthorizedError();
    return result.data;
};
