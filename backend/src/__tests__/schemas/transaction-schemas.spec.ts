import { ObjectId } from 'mongodb';
import {
    transactionCreateSchema,
    transactionSchema,
    transactionUpdateSchema,
} from '../../schemas/transaction-schemas';

describe('transaction schemas', () => {
    describe('transactionSchema', () => {
        const validData = {
            _id: new ObjectId(),
            month: '2025-10',
            name: 'Salary',
            value: 1200.5,
            isIncome: true,
            isRecurring: false,
            userId: new ObjectId(),
            createdAt: new Date(),
            updatedAt: null,
        };

        const validDataWithExtraKey = {
            ...validData,
            extraKey: 'extra value',
        };

        it('should accept valid data', () => {
            const data = transactionSchema.parse(validData);
            expect(data).toEqual(validData);
        });

        it('should refuse extra key', () => {
            expect(() =>
                transactionSchema.parse(validDataWithExtraKey),
            ).toThrow();
        });
    });

    describe('transactionCreateSchema', () => {
        const validData = {
            month: '2025-10',
            name: 'Salary',
            value: 1200.5,
            isIncome: true,
            isRecurring: false,
        };

        const validDataWithExtraKey = {
            ...validData,
            extraKey: 'extra value',
        };

        it('should accept valid data', () => {
            const data = transactionCreateSchema.parse(validData);
            expect(data).toEqual(validData);
        });

        it('should refuse extra key', () => {
            expect(() =>
                transactionCreateSchema.parse(validDataWithExtraKey),
            ).toThrow();
        });
    });

    describe('transactionUpdateSchema', () => {
        const validData = {
            name: 'Salary',
            value: 1200.5,
            isIncome: true,
            isRecurring: false,
        };

        const validDataWithExtraKey = {
            ...validData,
            extraKey: 'extra value',
        };

        it('should accept valid data', () => {
            const data = transactionUpdateSchema.parse(validData);
            expect(data).toEqual(validData);
        });

        it('should refuse extra key', () => {
            expect(() =>
                transactionUpdateSchema.parse(validDataWithExtraKey),
            ).toThrow();
        });
    });
});
