import type { $ZodErrorTree } from 'zod/v4/core';

export type ApiSuccess<T = void> = [T] extends [void] ? { success: true } : { success: true; data: T };

export type ApiError<E = void> = { success: false } & (
    | {
          code: 'BAD_REQUEST';
          tree: $ZodErrorTree<E>;
      }
    | {
          code:
              | 'ACTIVE_COOLDOWN'
              | 'DUPLICATE_EMAIL'
              | 'EMAIL_ALREADY_VERIFIED'
              | 'FORBIDDEN'
              | 'INTERNAL_SERVER_ERROR'
              | 'INVALID_CREDENTIALS'
              | 'INVALID_REFRESH_TOKEN'
              | 'INVALID_TOKEN'
              | 'ROUTE_NOT_FOUND'
              | 'TOO_MANY_REQUESTS'
              | 'TRANSACTION_NOT_FOUND'
              | 'UNAUTHORIZED';
      }
);

export type ApiResponse<T, E> = ApiSuccess<T> | ApiError<E>;
