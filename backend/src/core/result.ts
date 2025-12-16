export type Result<T, E> =
    | { success: true; value: T }
    | { success: false; error: E };

export const ok = <T>(value: T): Result<T, never> => {
    return { success: true, value };
};

export const fail = <E>(error: E): Result<never, E> => {
    return { success: false, error };
};
