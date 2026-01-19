import type { $ZodErrorTree } from 'zod/v4/core';
import type { BusinessRuleErrorReason } from '../../application/errors/business-rule.error.js';
import type { ApplicationErrorCode } from '../../application/errors/application.error.js';
import type { PresentationErrorCode } from '../errors/presentation.error.js';

export type ApiSuccess<T = void> = T extends void ? { success: true } : { success: true; data: T };

type ApiErrorCode = ApplicationErrorCode | PresentationErrorCode | 'INTERNAL_SERVER_ERROR';

export type ApiError<E = void> = { success: false } & (
    | {
          code: 'VALIDATION_ERROR';
          tree: $ZodErrorTree<E>;
      }
    | {
          code: 'BUSINESS_RULE_ERROR';
          reason: BusinessRuleErrorReason;
      }
    | {
          code: Exclude<ApiErrorCode, 'VALIDATION_ERROR' | 'BUSINESS_RULE_ERROR'>;
      }
);

export type ApiResponse<T, E> = ApiSuccess<T> | ApiError<E>;
