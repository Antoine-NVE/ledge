import mongoose from 'mongoose';
import * as yup from 'yup';

export function formatMongooseValidationErrors(
    error: mongoose.Error.ValidationError,
): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const [key, err] of Object.entries(error.errors)) {
        errors[key] = err.message;
    }

    return errors;
}

export const formatYupValidationErrors = (error: yup.ValidationError): Record<string, string[]> => {
    return error.inner.reduce<Record<string, string[]>>((acc, e) => {
        const field = e.path || 'unknown';
        (acc[field] ||= []).push(e.message);
        return acc;
    }, {});
};
