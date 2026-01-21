import type { NextFunction, Request, Response } from 'express';
import type { ApiError, BusinessRuleErrorReason } from '../../types/api-response.js';
import { RouteNotFoundError } from '../../errors/route-not-found.error.js';
import { TooManyRequestsError } from '../../errors/too-many-requests.error.js';
import { ValidationError } from '../../errors/validation.error.js';
import { AuthenticationError } from '../../../application/errors/authentication.error.js';
import { AuthorizationError } from '../../../application/errors/authorization.error.js';
import { ResourceNotFoundError } from '../../../application/errors/resource-not-found.error.js';
import { BusinessRuleError } from '../../../application/errors/business-rule.error.js';

export const errorHandlerMiddleware = () => {
    return (
        rawErr: unknown,
        req: Request,
        res: Response,
        _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
    ): void => {
        const err = rawErr instanceof Error ? rawErr : new Error('Unknown error', { cause: rawErr });

        if (err instanceof ValidationError) {
            const response: ApiError = {
                success: false,
                code: err.code,
                tree: err.tree,
            };
            res.status(400).json(response);
            return;
        }

        if (err instanceof BusinessRuleError) {
            const statusMap: Record<BusinessRuleErrorReason, number> = {
                DUPLICATE_EMAIL: 400,
                INVALID_TOKEN: 400,
                ACTIVE_COOLDOWN: 409,
                EMAIL_ALREADY_VERIFIED: 409,
            };

            const response: ApiError = {
                success: false,
                code: err.code,
                reason: err.reason,
            };
            res.status(statusMap[err.reason]).json(response);
            return;
        }

        if (err instanceof AuthenticationError) {
            const response: ApiError = {
                success: false,
                code: err.code,
            };
            res.status(401).json(response);
            return;
        }

        if (err instanceof AuthorizationError) {
            const response: ApiError = {
                success: false,
                code: err.code,
            };
            res.status(403).json(response);
            return;
        }

        if (err instanceof ResourceNotFoundError) {
            const response: ApiError = {
                success: false,
                code: err.code,
            };
            res.status(404).json(response);
            return;
        }

        if (err instanceof RouteNotFoundError) {
            const response: ApiError = {
                success: false,
                code: err.code,
            };
            res.status(404).json(response);
            return;
        }

        if (err instanceof TooManyRequestsError) {
            const response: ApiError = {
                success: false,
                code: err.code,
            };
            res.status(429).json(response);
            return;
        }

        req.logger.error(err.message, { err });
        const response: ApiError = {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
        res.status(500).json(response);
    };
};
