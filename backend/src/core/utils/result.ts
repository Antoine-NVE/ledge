import type { Result } from '../types/result.js';

export const ok = <T>(value: T): Result<T, never> => {
    return { success: true, value };
};

export const fail = <E>(error: E): Result<never, E> => {
    return { success: false, error };
};
