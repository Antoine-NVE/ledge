import { describe, expect, it } from 'vitest';
import { fakeExpenseTransaction, fakeIncomeTransaction } from '../../../fakes/transaction.js';
import {
    toTransaction,
    toTransactionDocument,
} from '../../../../src/infrastructure/mappers/mongo.transaction.mapper.js';
import { ObjectId } from 'mongodb';

describe('MongoTransactionMapper', () => {
    describe('toTransactionDocument', () => {
        it('should map an EXPENSE transaction to a document correctly', () => {
            const expense = fakeExpenseTransaction();
            const document = toTransactionDocument(expense);

            expect(document._id).toBeInstanceOf(ObjectId);
            expect(document._id.toString()).toBe(expense.id);
            expect(document.userId).toBeInstanceOf(ObjectId);
            expect(document.userId.toString()).toBe(expense.userId);

            expect(document).toHaveProperty('expenseCategory', expense.expenseCategory);
            expect(document.type).toBe('expense');
        });

        it('should map an INCOME transaction to a document correctly', () => {
            const income = fakeIncomeTransaction();

            const document = toTransactionDocument(income);

            expect(document._id.toString()).toBe(income.id);
            expect(document.type).toBe('income');

            expect(document).not.toHaveProperty('expenseCategory');
        });

        it('should throw an error when providing an invalid ID format', () => {
            const transaction = fakeExpenseTransaction({ id: 'invalid-id' });
            expect(() => toTransactionDocument(transaction)).toThrow();
        });
    });

    describe('toTransaction', () => {
        it('should map an EXPENSE document back to a domain entity (Round-trip)', () => {
            const originalExpense = fakeExpenseTransaction();
            const document = toTransactionDocument(originalExpense);

            const result = toTransaction(document);

            expect(result).toEqual(originalExpense);
        });

        it('should map an INCOME document back to a domain entity (Round-trip)', () => {
            const originalIncome = fakeIncomeTransaction();
            const document = toTransactionDocument(originalIncome);

            const result = toTransaction(document);

            expect(result).toEqual(originalIncome);
            expect(result.expenseCategory).toBeNull();
        });
    });
});
