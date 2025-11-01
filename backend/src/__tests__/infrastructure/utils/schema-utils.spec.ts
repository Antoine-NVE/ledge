import z from 'zod';
import { formatZodError } from '../../../infrastructure/utils/format-utils';

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

            expect(formatZodError(error!)).toEqual({
                field1: ['Error 1', 'Error 2'],
                field2: ['Error 3'],
            });
        });

        it('should format errors with only form errors', () => {
            const { error } = schema.safeParse(validDataWithExtraKey);

            expect(formatZodError(error!)).toEqual({
                global: ['Error 4'],
            });
        });

        it('should format errors with both errors', () => {
            const { error } = schema.safeParse(invalidDataWithExtraKey);

            expect(formatZodError(error!)).toEqual({
                field1: ['Error 1', 'Error 2'],
                field2: ['Error 3'],
                global: ['Error 4'],
            });
        });
    });
});
