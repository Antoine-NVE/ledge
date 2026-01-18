import type { $ZodIssue } from 'zod/v4/core';

export type ApiSuccess<T> = {
    success: true;
    code: string;
    message: string;
    data?: T;
};

export type ApiError = {
    success: false;
    code: string;
    message: string;
    issues?: $ZodIssue[];
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
