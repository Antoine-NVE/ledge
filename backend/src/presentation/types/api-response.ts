import type { $ZodErrorTree } from 'zod/v4/core';
import type { Reason } from '../../application/errors/business-rule.error.js';

export type ApiSuccess<T = void> = T extends void ? { success: true } : { success: true; data: T };

export type ApiError<E = void> = {
    success: false;
} & (
    | {
          code: 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR' | 'RESOURCE_NOT_FOUND_ERROR';
      }
    | {
          code: 'BUSINESS_RULE_ERROR';
          reason: Reason;
      }
    | {
          code: 'VALIDATION_ERROR';
          tree: $ZodErrorTree<E>;
      }
);

export type ApiResponse<T, E> = ApiSuccess<T> | ApiError<E>;
