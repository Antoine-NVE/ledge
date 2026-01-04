import type { Context } from '../../src/infrastructure/config/migration.js';

export const up = async ({ context: { mongoDb } }: { context: Context }) => {
    await mongoDb.collection('refreshtokens').updateMany({ token: { $exists: true } }, { $rename: { token: 'value' } });
};

export const down = async ({ context: { mongoDb } }: { context: Context }) => {
    await mongoDb.collection('refreshtokens').updateMany({ value: { $exists: true } }, { $rename: { value: 'token' } });
};
