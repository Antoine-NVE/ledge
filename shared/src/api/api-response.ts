import type { $ZodErrorTree } from 'zod/v4/core';

export type ApiSuccess<T = void> = T extends void ? { success: true } : { success: true; data: T };

export type PresentationErrorCode = 'ROUTE_NOT_FOUND_ERROR' | 'TOO_MANY_REQUESTS_ERROR' | 'VALIDATION_ERROR';

export type ApplicationErrorCode =
    | 'AUTHENTICATION_ERROR'
    | 'AUTHORIZATION_ERROR'
    | 'BUSINESS_RULE_ERROR'
    | 'RESOURCE_NOT_FOUND_ERROR';

export type BusinessRuleErrorReason =
    | 'ACTIVE_COOLDOWN'
    | 'DUPLICATE_EMAIL'
    | 'EMAIL_ALREADY_VERIFIED'
    | 'INVALID_TOKEN';

type ApiErrorCode = PresentationErrorCode | ApplicationErrorCode | 'INTERNAL_SERVER_ERROR';

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
