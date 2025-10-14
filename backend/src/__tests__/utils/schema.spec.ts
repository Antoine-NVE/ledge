import z from 'zod';
import { formatError, parseSchema } from '../../utils/schema';
import { ValidationError } from '../../errors/BadRequestError';
import { InvalidDataError } from '../../errors/InternalServerError';

describe('schema utils', () => {
    const schema = z.strictObject(
        {
            field1: z.string().min(5, 'Error 1'),
            field2: z.number().min(10, 'Error 2'),
        },
        'Global error',
    );

    describe('formatError()', () => {
        it('should format ZodError correctly with formErrors and fieldErrors', () => {
            const { error } = schema.safeParse({
                field1: 'abc',
                field2: 5,
                field3: 'extra field',
            });

            const formatted = formatError(error!);

            expect(formatted).toEqual({
                global: ['Global error'],
                field1: ['Error 1'],
                field2: ['Error 2'],
            });
        });

        it('should format ZodError correctly with only fieldErrors', () => {
            const { error } = schema.safeParse({
                field1: 'abc',
                field2: 5,
            });

            const formatted = formatError(error!);
            expect(formatted).toEqual({
                field1: ['Error 1'],
                field2: ['Error 2'],
            });
        });

        it('should format ZodError correctly with only formErrors', () => {
            const { error } = schema.safeParse({
                field1: 'valid string',
                field2: 15,
                field3: 'extra field',
            });

            const formatted = formatError(error!);
            expect(formatted).toEqual({
                global: ['Global error'],
            });
        });
    });

    describe('parseSchema()', () => {
        it('should parse valid data correctly', () => {
            const data = {
                field1: 'valid string',
                field2: 15,
            };

            const parsed = parseSchema(schema, data);
            expect(parsed).toEqual(data);
        });

        it('should throw ValidationError for invalid data when isClientError is true', () => {
            const data = {
                field1: 'abc',
                field2: 5,
            };

            expect(() => parseSchema(schema, data, true)).toThrow(
                ValidationError,
            );
        });

        it('should throw InvalidDataError for invalid data when isClientError is false', () => {
            const data = {
                field1: 'abc',
                field2: 5,
            };

            expect(() => parseSchema(schema, data, false)).toThrow(
                InvalidDataError,
            );
        });

        it('should throw InvalidDataError for invalid data when isClientError is omitted', () => {
            const data = {
                field1: 'abc',
                field2: 5,
            };

            expect(() => parseSchema(schema, data)).toThrow(InvalidDataError);
        });
    });
});
