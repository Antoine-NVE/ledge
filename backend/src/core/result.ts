export type Result<T, E> = { success: true; data: T } | { success: false; error: E };

export const ok = <T>(data: T): Result<T, never> => {
    return { success: true, data };
};

export const fail = <E>(error: E): Result<never, E> => {
    return { success: false, error };
};
