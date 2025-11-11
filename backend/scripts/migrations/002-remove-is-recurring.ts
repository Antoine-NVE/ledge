import { Db } from 'mongodb';

export const up = async ({ context: db }: { context: Db }) => {
    await db
        .collection('transactions')
        .updateMany(
            { isRecurring: { $exists: true } },
            { $unset: { isRecurring: '' } },
        );
};

export const down = async ({ context: db }: { context: Db }) => {
    await db
        .collection('transactions')
        .updateMany(
            { isRecurring: { $exists: false } },
            { $set: { isRecurring: false } },
        );
};
