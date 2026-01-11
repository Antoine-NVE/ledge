import { BaseController } from './base-controller.js';
import type { TokenManager } from '../../../application/ports/token-manager.js';
import type { Request } from 'express';
import { AuthenticationError } from '../../../application/errors/authentication.error.js';

export abstract class AuthenticatedController extends BaseController {
    protected constructor(private tokenManager: TokenManager) {
        super();
    }

    protected getUserId(req: Request): string {
        const accessToken = this.findAccessToken(req);
        if (!accessToken) throw new AuthenticationError();

        const { userId } = this.tokenManager.verifyAccess(accessToken);

        return userId;
    }
}
