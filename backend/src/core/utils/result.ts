import type { Result } from '../types/result.js';

export const ok = <T>(data: T): Result<T, never> => {
    return { success: true, data };
};

export const fail = <E>(error: E): Result<never, E> => {
    return { success: false, error };
};
