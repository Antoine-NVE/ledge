import type { Transaction } from '../../src/domain/entities/transaction.js';

// I couldn't find a way to have one factory for both

export const fakeExpenseTransaction = (
    overrides: Partial<Extract<Transaction, { type: 'expense' }>> = {},
): Transaction => ({
    id: '607f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439011',
    month: '2026-02',
    name: 'Courses',
    value: 150,
    type: 'expense',
    expenseCategory: 'need',
    createdAt: new Date('2025-01-01T10:00:00.000Z'),
    updatedAt: new Date('2026-01-01T10:00:00.000Z'),
    ...overrides,
});

export const fakeIncomeTransaction = (
    overrides: Partial<Extract<Transaction, { type: 'income' }>> = {},
): Transaction => ({
    id: '607f1f77bcf86cd799439012',
    userId: '507f1f77bcf86cd799439011',
    month: '2026-02',
    name: 'Salaire',
    value: 2500,
    type: 'income',
    expenseCategory: null,
    createdAt: new Date('2025-01-01T10:00:00.000Z'),
    updatedAt: new Date('2026-01-01T10:00:00.000Z'),
    ...overrides,
});
