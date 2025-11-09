import {
    createBodySchema,
    updateBodySchema,
} from '../../../presentation/transaction/transaction-schemas';

describe('Transaction schemas', () => {
    describe('createBodySchema', () => {
        let validData: object;

        beforeEach(() => {
            validData = {
                month: '2025-11',
                name: 'Test',
                value: 452.42,
                isIncome: false,
                isRecurring: false,
            };
        });

        it('should accept a valid month', () => {
            const { success } = createBodySchema.safeParse(validData);

            expect(success).toBe(true);
        });

        it('should refuse an invalid month', () => {
            let data = createBodySchema.safeParse({
                ...validData,
                month: '2025/11',
            });

            expect(data.success).toBe(false);

            data = createBodySchema.safeParse({
                ...validData,
                month: 'november',
            });

            expect(data.success).toBe(false);
        });

        it('should accept a valid value', () => {
            let data = createBodySchema.safeParse(validData);

            expect(data.success).toBe(true);

            data = createBodySchema.safeParse({
                ...validData,
                value: 123,
            });

            expect(data.success).toBe(true);
        });

        it('should refuse an invalid value', () => {
            const { success } = createBodySchema.safeParse({
                ...validData,
                value: 123.456,
            });

            expect(success).toBe(false);
        });
    });

    describe('updateBodySchema', () => {
        let validData: object;

        beforeEach(() => {
            validData = {
                name: 'Test',
                value: 452.42,
                isIncome: false,
                isRecurring: false,
            };
        });

        it('should accept a valid value', () => {
            let data = updateBodySchema.safeParse(validData);

            console.log(data);

            expect(data.success).toBe(true);

            data = updateBodySchema.safeParse({
                ...validData,
                value: 123,
            });

            expect(data.success).toBe(true);
        });

        it('should refuse an invalid value', () => {
            const { success } = updateBodySchema.safeParse({
                ...validData,
                value: 123.456,
            });

            expect(success).toBe(false);
        });
    });
});
