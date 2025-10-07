import * as yup from 'yup';
import z from 'zod';

export const formatZodValidationErrors = (err: z.ZodError): Record<string, string[]> => {
    const error: {
        errors: string[];
        properties?: Record<string, { errors: string[] }>;
    } = z.treeifyError(err);
    const result: Record<string, string[]> = {};

    if (error.errors.length > 0) {
        result.other = error.errors;
    }

    if (error.properties) {
        for (const [field, info] of Object.entries(error.properties)) {
            if (info.errors && info.errors.length > 0) {
                result[field] = info.errors;
            }
        }
    }

    return result;
};
