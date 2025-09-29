import { Error as MongooseError } from 'mongoose';

export function formatMongooseValidationErrors(
    error: MongooseError.ValidationError,
): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const [key, err] of Object.entries(error.errors)) {
        errors[key] = err.message;
    }

    return errors;
}
