import z from 'zod';
import { formatError, parseSchema } from '../../utils/schema';
import { ValidationError } from '../../errors/BadRequestError';
import { InvalidDataError } from '../../errors/InternalServerError';

describe('schema utils', () => {
    const schema = z.strictObject(
        {
            field1: z.string().max(5, 'Error 1').startsWith('Valid', 'Error 2'),
            field2: z.number().min(5, 'Error 3'),
        },
        'Error 4',
    );

    const validData = {
        field1: 'Valid',
        field2: 5,
    };

    const validDataWithExtraKey = {
        field1: 'Valid',
        field2: 5,
        field3: 'Extra',
    };

    const invalidData = {
        field1: 'Invalid',
        field2: 4,
    };

    const invalidDataWithExtraKey = {
        field1: 'Invalid',
        field2: 4,
        field3: 'Extra',
    };

    describe('formatError', () => {
        it('should format errors with only field errors', () => {
            const { error } = schema.safeParse(invalidData);

            expect(formatError(error!)).toEqual({
                field1: ['Error 1', 'Error 2'],
                field2: ['Error 3'],
            });
        });

        it('should format errors with only form errors', () => {
            const { error } = schema.safeParse(validDataWithExtraKey);

            expect(formatError(error!)).toEqual({
                global: ['Error 4'],
            });
        });

        it('should format errors with both errors', () => {
            const { error } = schema.safeParse(invalidDataWithExtraKey);

            expect(formatError(error!)).toEqual({
                field1: ['Error 1', 'Error 2'],
                field2: ['Error 3'],
                global: ['Error 4'],
            });
        });
    });

    describe('parseSchema', () => {
        it('should return data if valid', () => {
            expect(parseSchema(schema, validData)).toEqual(validData);
        });

        it('should throw a ValidationError if asked to', () => {
            expect(() => parseSchema(schema, invalidData, true)).toThrow(
                ValidationError,
            );
        });

        it('should throw a InvalidDataError if asked to', () => {
            expect(() => parseSchema(schema, invalidData, false)).toThrow(
                InvalidDataError,
            );
        });

        it('should throw a InvalidDataError if not specified', () => {
            expect(() => parseSchema(schema, invalidData)).toThrow(
                InvalidDataError,
            );
        });
    });
});
