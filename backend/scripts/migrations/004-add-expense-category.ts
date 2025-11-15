import { Db } from 'mongodb';

export const up = async ({ context: db }: { context: Db }) => {
    await db
        .collection('transactions')
        .updateMany({ type: 'expense' }, { $set: { expenseCategory: null } });
};

export const down = async ({ context: db }: { context: Db }) => {
    await db
        .collection('transactions')
        .updateMany({}, { $unset: { expenseCategory: '' } });
};
