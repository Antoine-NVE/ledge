import { Db } from 'mongodb';

export const up = async ({ context: db }: { context: Db }) => {
    const collection = db.collection('transactions');

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

export const down = async ({ context: db }: { context: Db }) => {
    const collection = db.collection('transactions');

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
