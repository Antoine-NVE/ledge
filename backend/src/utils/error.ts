import mongoose from 'mongoose';
import * as yup from 'yup';
import z from 'zod';

export function formatMongooseValidationErrors(
    error: mongoose.Error.ValidationError,
): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const [key, err] of Object.entries(error.errors)) {
        errors[key] = err.message;
    }

    return errors;
}

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
