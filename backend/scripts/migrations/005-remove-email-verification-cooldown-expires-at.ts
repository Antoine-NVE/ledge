import { Db } from 'mongodb';

export const up = async ({ context: db }: { context: Db }) => {
    await db
        .collection('users')
        .updateMany(
            { emailVerificationCooldownExpiresAt: { $exists: true } },
            { $unset: { emailVerificationCooldownExpiresAt: '' } },
        );
};

export const down = async () => {};
