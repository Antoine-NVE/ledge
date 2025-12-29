export const ensureError = (err: unknown): Error => {
    if (err instanceof Error) return err;

    return new Error('Unknown error', { cause: err });
};
