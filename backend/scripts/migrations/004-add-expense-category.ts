import type { Context } from '../../src/infrastructure/config/umzug.js';

export const up = async ({ context: { mongoDb } }: { context: Context }) => {
    await mongoDb
        .collection('transactions')
        .updateMany({ type: 'expense', expenseCategory: { $exists: false } }, { $set: { expenseCategory: null } });
};

export const down = async ({ context: { mongoDb } }: { context: Context }) => {
    await mongoDb.collection('transactions').updateMany({}, { $unset: { expenseCategory: '' } });
};
