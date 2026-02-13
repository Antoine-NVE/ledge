import { describe, it, expect } from 'vitest';
import { fakeUser } from '../../fakes/user.js';
import { toUser, toUserDocument } from '../../../src/infrastructure/mappers/mongo.user.mapper.js';
import { ObjectId } from 'mongodb';

describe('MongoUserMapper', () => {
    describe('toUserDocument', () => {
        it('should map a valid User to a UserDocument correctly', () => {
            const user = fakeUser();
            const userDocument = toUserDocument(user);

            expect(userDocument._id).toBeInstanceOf(ObjectId);
            expect(userDocument._id.toString()).toBe(user.id);
            expect(userDocument).toMatchObject({
                email: user.email,
                passwordHash: user.passwordHash,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        });

        it('should throw an error when providing an invalid ID format', () => {
            const user = fakeUser({ id: 'invalid-id' });

            expect(() => toUserDocument(user)).toThrow();
        });
    });

    describe('toUser', () => {
        it('should map a UserDocument back to a User domain entity', () => {
            const user1 = fakeUser();
            const userDocument = toUserDocument(user1);
            const user2 = toUser(userDocument);

            expect(user2).toEqual(user1);
        });
    });
});
