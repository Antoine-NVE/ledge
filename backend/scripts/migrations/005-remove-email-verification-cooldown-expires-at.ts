import type { Context } from '../../src/infrastructure/config/umzug.js';

export const up = async ({ context: { mongoDb } }: { context: Context }) => {
    await mongoDb
        .collection('users')
        .updateMany(
            { emailVerificationCooldownExpiresAt: { $exists: true } },
            { $unset: { emailVerificationCooldownExpiresAt: '' } },
        );
};

export const down = async () => {};
