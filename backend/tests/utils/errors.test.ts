import { describe, it, expect } from '@jest/globals';
import { Error as MongooseError } from 'mongoose';
import { formatMongooseValidationErrors } from '../../src/utils/errors';

describe('formatMongooseValidationErrors', () => {
    it('should return a field→message object for each ValidatorError', () => {
        const validationError = new MongooseError.ValidationError();

        validationError.addError(
            'email',
            new MongooseError.ValidatorError({
                path: 'email',
                message: 'Invalid email',
            }),
        );
        validationError.addError(
            'password',
            new MongooseError.ValidatorError({
                path: 'password',
                message: 'Password is too short',
            }),
        );

        const formatted = formatMongooseValidationErrors(validationError);

        expect(formatted).toEqual({
            email: 'Invalid email',
            password: 'Password is too short',
        });
    });

    it('handles the case where there are no errors', () => {
        const validationError = new MongooseError.ValidationError();
        const formatted = formatMongooseValidationErrors(validationError);
        expect(formatted).toEqual({});
    });
});
