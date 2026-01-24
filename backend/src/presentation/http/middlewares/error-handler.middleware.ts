import type { NextFunction, Request, Response } from 'express';
import { RouteNotFoundError } from '../../errors/route-not-found.error.js';
import { TooManyRequestsError } from '../../errors/too-many-requests.error.js';
import { ValidationError } from '../../errors/validation.error.js';
import { AuthenticationError } from '../../../application/errors/authentication.error.js';
import { AuthorizationError } from '../../../application/errors/authorization.error.js';
import { ResourceNotFoundError } from '../../../application/errors/resource-not-found.error.js';
import { BusinessRuleError } from '../../../application/errors/business-rule.error.js';
import type { ApiError, BusinessRuleErrorReason } from '@shared/api/api-response.js';

export const errorHandlerMiddleware = () => {
    return (
        rawErr: unknown,
        req: Request,
        res: Response,
        _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
    ): void => {
        const err = rawErr instanceof Error ? rawErr : new Error('Unknown error', { cause: rawErr });

        if (err instanceof ValidationError) {
            req.logger.warn(err.message, { err });
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
                DUPLICATE_EMAIL: 409,
                INVALID_TOKEN: 400,
                ACTIVE_COOLDOWN: 429,
                EMAIL_ALREADY_VERIFIED: 409,
            };

            req.logger.warn(err.message, { err });
            const response: ApiError = {
                success: false,
                code: err.code,
                reason: err.reason,
            };
            res.status(statusMap[err.reason]).json(response);
            return;
        }

        if (err instanceof AuthenticationError) {
            req.logger.warn(err.message, { err });
            const response: ApiError = {
                success: false,
                code: err.code,
            };
            res.status(401).json(response);
            return;
        }

        if (err instanceof AuthorizationError) {
            req.logger.warn(err.message, { err });
            const response: ApiError = {
                success: false,
                code: err.code,
            };
            res.status(403).json(response);
            return;
        }

        if (err instanceof ResourceNotFoundError) {
            req.logger.warn(err.message, { err });
            const response: ApiError = {
                success: false,
                code: err.code,
            };
            res.status(404).json(response);
            return;
        }

        if (err instanceof RouteNotFoundError) {
            req.logger.warn(err.message, { err });
            const response: ApiError = {
                success: false,
                code: err.code,
            };
            res.status(404).json(response);
            return;
        }

        if (err instanceof TooManyRequestsError) {
            req.logger.warn(err.message, { err });
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
