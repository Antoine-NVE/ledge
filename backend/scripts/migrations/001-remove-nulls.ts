import type { Context } from '../../src/infrastructure/config/umzug.js';

export const up = async ({ context: { mongoDb } }: { context: Context }) => {
    await mongoDb.collection('users').updateMany({ updatedAt: null }, { $unset: { updatedAt: '' } });
    await mongoDb.collection('transactions').updateMany({ updatedAt: null }, { $unset: { updatedAt: '' } });
    await mongoDb.collection('refreshtokens').updateMany({ updatedAt: null }, { $unset: { updatedAt: '' } });

    await mongoDb
        .collection('users')
        .updateMany(
            { emailVerificationCooldownExpiresAt: null },
            { $unset: { emailVerificationCooldownExpiresAt: '' } },
        );
};

export const down = async ({ context: { mongoDb } }: { context: Context }) => {
    await mongoDb.collection('users').updateMany({ updatedAt: { $exists: false } }, { $set: { updatedAt: null } });
    await mongoDb
        .collection('transactions')
        .updateMany({ updatedAt: { $exists: false } }, { $set: { updatedAt: null } });
    await mongoDb
        .collection('refreshtokens')
        .updateMany({ updatedAt: { $exists: false } }, { $set: { updatedAt: null } });

    await mongoDb
        .collection('users')
        .updateMany(
            { emailVerificationCooldownExpiresAt: { $exists: false } },
            { $set: { emailVerificationCooldownExpiresAt: null } },
        );
};
