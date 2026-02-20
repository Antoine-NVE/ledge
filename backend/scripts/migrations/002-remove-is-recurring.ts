import type { Context } from '../../src/infrastructure/config/umzug.js';

export const up = async ({ context: { mongoDb } }: { context: Context }) => {
    await mongoDb
        .collection('transactions')
        .updateMany({ isRecurring: { $exists: true } }, { $unset: { isRecurring: '' } });
};

export const down = async ({ context: { mongoDb } }: { context: Context }) => {
    await mongoDb
        .collection('transactions')
        .updateMany({ isRecurring: { $exists: false } }, { $set: { isRecurring: false } });
};
