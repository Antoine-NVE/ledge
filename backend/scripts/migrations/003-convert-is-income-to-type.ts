import type { Context } from '../../src/infrastructure/config/umzug.js';

export const up = async ({ context: { mongoDb } }: { context: Context }) => {
    const collection = mongoDb.collection('transactions');

    await collection.updateMany(
        { isIncome: true },
        {
            $set: { type: 'income' },
            $unset: { isIncome: '' },
        },
    );

    await collection.updateMany(
        { isIncome: false },
        {
            $set: { type: 'expense' },
            $unset: { isIncome: '' },
        },
    );
};

export const down = async ({ context: { mongoDb } }: { context: Context }) => {
    const collection = mongoDb.collection('transactions');

    await collection.updateMany(
        { type: 'income' },
        {
            $set: { isIncome: true },
            $unset: { type: '' },
        },
    );

    await collection.updateMany(
        { type: 'expense' },
        {
            $set: { isIncome: false },
            $unset: { type: '' },
        },
    );
};
