import { ObjectId } from 'mongodb';
import {
    transactionCreateSchema,
    transactionSchema,
    transactionUpdateSchema,
} from '../../schemas/transaction';
import { Transaction } from '../../types/Transaction';

describe('transaction schemas', () => {
    describe('transactionSchema', () => {
        const validTransaction: Transaction = {
            _id: new ObjectId(),
            month: '2023-10',
            name: 'Salary',
            value: 5000.0,
            isIncome: true,
            isRecurring: true,
            userId: new ObjectId(),
            createdAt: new Date(),
            updatedAt: null,
        };

        const invalidTransaction = {
            _id: 'not-an-objectid',
            month: '2023-13',
            name: '',
            value: -100,
            isIncome: 'not-a-boolean',
            isRecurring: 'not-a-boolean',
            userId: 'not-an-objectid',
            createdAt: 'not-a-date',
            updatedAt: 'not-a-date',
        };

        it('should validate a correct transaction object', () => {
            expect(() => {
                transactionSchema.parse(validTransaction);
            }).not.toThrow();
        });

        it('should throw an error for an incorrect transaction object', () => {
            expect(() => {
                transactionSchema.parse(invalidTransaction);
            }).toThrow();
        });

        it('should throw an error if there are unknown keys', () => {
            const validTransactionWithExtra = {
                ...validTransaction,
                extraKey: 'extra_value',
            };
            expect(() => {
                transactionSchema.parse(validTransactionWithExtra);
            }).toThrow();
        });
    });

    describe('transactionCreateSchema', () => {
        const validCreateData = {
            month: '2023-10',
            name: 'Freelance Project',
            value: 1500.0,
            isIncome: true,
            isRecurring: false,
        };

        const invalidCreateData = {
            month: '2023-00',
            name: '',
            value: 0,
            isIncome: 'not-a-boolean',
            isRecurring: 'not-a-boolean',
        };

        it('should validate correct create data', () => {
            expect(() => {
                transactionCreateSchema.parse(validCreateData);
            }).not.toThrow();
        });

        it('should throw an error for incorrect create data', () => {
            expect(() => {
                transactionCreateSchema.parse(invalidCreateData);
            }).toThrow();
        });
    });

    describe('transactionUpdateSchema', () => {
        const validUpdateData = {
            name: 'Updated Name',
            value: 2000.0,
            isIncome: false,
            isRecurring: true,
        };

        const invalidUpdateData = {
            name: '',
            value: -50,
            isIncome: 'not-a-boolean',
            isRecurring: 'not-a-boolean',
        };

        it('should validate correct update data', () => {
            expect(() => {
                transactionUpdateSchema.parse(validUpdateData);
            }).not.toThrow();
        });

        it('should throw an error for incorrect update data', () => {
            expect(() => {
                transactionUpdateSchema.parse(invalidUpdateData);
            }).toThrow();
        });
    });
});
