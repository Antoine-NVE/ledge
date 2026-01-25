import type { Context } from '../../src/infrastructure/config/umzug.js';

const collections = ['users', 'transactions', 'refreshtokens'];

export const up = async ({ context: { mongoDb } }: { context: Context }) => {
    for (const collectionName of collections) {
        await mongoDb
            .collection(collectionName)
            .updateMany({ updatedAt: { $exists: false } }, [{ $set: { updatedAt: '$createdAt' } }]);
    }
};

export const down = async ({ context: { mongoDb } }: { context: Context }) => {
    for (const collectionName of collections) {
        await mongoDb
            .collection(collectionName)
            .updateMany({ $expr: { $eq: ['$updatedAt', '$createdAt'] } }, { $unset: { updatedAt: '' } });
    }
};
