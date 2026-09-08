import { User } from '../../../domain/entities/user.js';
import type { MongoUserDocument } from '../documents/mongo.user.document.js';
import { ObjectId } from 'mongodb';

export const MongoUserMapper = {
    toDocument: (user: User): MongoUserDocument => ({
        _id: new ObjectId(user.id),
        email: user.email,
        passwordHash: user.passwordHash,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }),

    toEntity: (document: MongoUserDocument): User =>
        User.reconstitute(
            document._id.toString(),
            document.email,
            document.passwordHash,
            document.isEmailVerified,
            document.createdAt,
            document.updatedAt,
        ),
};
