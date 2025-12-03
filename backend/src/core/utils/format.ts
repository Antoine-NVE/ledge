import z from 'zod';

export const formatZodError = (error: z.ZodError): Record<string, string[]> => {
    const { formErrors, fieldErrors } = z.flattenError(error);

    return formErrors.length > 0
        ? { global: formErrors, ...fieldErrors }
        : fieldErrors;
};
