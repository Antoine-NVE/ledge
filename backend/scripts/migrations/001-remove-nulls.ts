import { Db } from 'mongodb';

export const up = async ({ context: db }: { context: Db }) => {
    await db
        .collection('users')
        .updateMany({ updatedAt: null }, { $unset: { updatedAt: '' } });
    await db
        .collection('transactions')
        .updateMany({ updatedAt: null }, { $unset: { updatedAt: '' } });
    await db
        .collection('refreshtokens')
        .updateMany({ updatedAt: null }, { $unset: { updatedAt: '' } });

    await db
        .collection('users')
        .updateMany(
            { emailVerificationCooldownExpiresAt: null },
            { $unset: { emailVerificationCooldownExpiresAt: '' } },
        );
};

export const down = async ({ context: db }: { context: Db }) => {
    await db
        .collection('users')
        .updateMany(
            { updatedAt: { $exists: false } },
            { $set: { updatedAt: null } },
        );
    await db
        .collection('transactions')
        .updateMany(
            { updatedAt: { $exists: false } },
            { $set: { updatedAt: null } },
        );
    await db
        .collection('refreshtokens')
        .updateMany(
            { updatedAt: { $exists: false } },
            { $set: { updatedAt: null } },
        );

    await db
        .collection('users')
        .updateMany(
            { emailVerificationCooldownExpiresAt: { $exists: false } },
            { $set: { emailVerificationCooldownExpiresAt: null } },
        );
};
