import z from 'zod';
import { formatError } from '../../utils/schema';
import * as schemaUtils from '../../utils/schema';
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

    const extraKey = {
        field3: 'Extra',
    };

    const validData = {
        field1: 'Valid',
        field2: 5,
    };

    const validDataWithExtraKey = {
        ...validData,
        ...extraKey,
    };

    const invalidData = {
        field1: 'Invalid',
        field2: 4,
    };

    const invalidDataWithExtraKey = {
        ...invalidData,
        ...extraKey,
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
        beforeEach(() => {
            jest.spyOn(schemaUtils, 'formatError').mockReturnValue({
                mocked: ['fake error'],
            });
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should return data if valid', () => {
            expect(schemaUtils.parseSchema(schema, validData)).toEqual(
                validData,
            );
        });

        it('should throw a ValidationError if asked to', () => {
            expect(() =>
                schemaUtils.parseSchema(schema, invalidData, true),
            ).toThrow(ValidationError);
        });

        it('should throw a InvalidDataError if asked to', () => {
            expect(() =>
                schemaUtils.parseSchema(schema, invalidData, false),
            ).toThrow(InvalidDataError);
        });

        it('should throw a InvalidDataError if not specified', () => {
            expect(() => schemaUtils.parseSchema(schema, invalidData)).toThrow(
                InvalidDataError,
            );
        });
    });
});
