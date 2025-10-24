import z from 'zod';
import { BadRequestError } from '../errors/BadRequestError';
import { InternalServerError } from '../errors/InternalServerError';

export const formatError = (error: z.ZodError): Record<string, string[]> => {
    const { formErrors, fieldErrors } = z.flattenError(error);

    return formErrors.length > 0
        ? { global: formErrors, ...fieldErrors }
        : fieldErrors;
};

export const parseSchema = <T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    isClientError: boolean = false,
): T => {
    const result = schema.safeParse(data);

    if (!result.success) {
        const formatted = formatError(result.error);
        if (isClientError)
            throw new BadRequestError('Validation error', formatted);
        throw new InternalServerError('Validation error', formatted);
    }

    return result.data;
};
