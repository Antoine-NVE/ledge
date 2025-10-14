import z from 'zod';
import { formatError, parseSchema } from '../../utils/schema';
import { ValidationError } from '../../errors/BadRequestError';
import { InvalidDataError } from '../../errors/InternalServerError';

describe('schema utils', () => {
    const schema = z.strictObject(
        {
            field1: z.string().min(5, 'Error 1').startsWith('valid', 'Error 2'),
            field2: z.number().min(10, 'Error 3'),
        },
        'Global error',
    );

    const validData = {
        field1: 'valid string',
        field2: 15,
    };

    const validDataWithExtra = {
        field1: 'valid string',
        field2: 15,
        field3: 'extra field',
    };

    const invalidData = {
        field1: 'abc',
        field2: 5,
    };

    const invalidDataWithExtra = {
        field1: 'abc',
        field2: 5,
        field3: 'extra field',
    };

    describe('formatError()', () => {
        it('should format ZodError correctly with formErrors and fieldErrors', () => {
            const { error } = schema.safeParse(invalidDataWithExtra);

            const formatted = formatError(error!);

            expect(formatted).toEqual({
                global: ['Global error'],
                field1: ['Error 1', 'Error 2'],
                field2: ['Error 3'],
            });
        });

        it('should format ZodError correctly with only fieldErrors', () => {
            const { error } = schema.safeParse(invalidData);

            const formatted = formatError(error!);
            expect(formatted).toEqual({
                field1: ['Error 1', 'Error 2'],
                field2: ['Error 3'],
            });
        });

        it('should format ZodError correctly with only formErrors', () => {
            const { error } = schema.safeParse(validDataWithExtra);

            const formatted = formatError(error!);
            expect(formatted).toEqual({
                global: ['Global error'],
            });
        });
    });

    describe('parseSchema()', () => {
        it('should parse valid data correctly', () => {
            const parsed = parseSchema(schema, validData);
            expect(parsed).toEqual(validData);
        });

        it('should throw ValidationError for invalid data when isClientError is true', () => {
            expect(() => parseSchema(schema, invalidData, true)).toThrow(
                ValidationError,
            );
        });

        it('should throw InvalidDataError for invalid data when isClientError is false', () => {
            expect(() => parseSchema(schema, invalidData, false)).toThrow(
                InvalidDataError,
            );
        });

        it('should throw InvalidDataError for invalid data when isClientError is omitted', () => {
            expect(() => parseSchema(schema, invalidData)).toThrow(
                InvalidDataError,
            );
        });
    });
});
