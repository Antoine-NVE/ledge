import { BaseController } from './base-controller.js';
import type { TokenManager } from '../../../application/ports/token-manager.js';
import type { Request } from 'express';

export abstract class AuthenticatedController extends BaseController {
    protected constructor(private tokenManager: TokenManager) {
        super();
    }

    protected getUserId(req: Request): string {
        const accessToken = this.getAccessToken(req);

        const result = this.tokenManager.verifyAccess(accessToken);
        if (!result.success) throw result.error;
        const { userId } = result.data;

        return userId;
    }
}
