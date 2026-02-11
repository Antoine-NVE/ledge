import type { User } from '../../domain/entities/user.js';
import type { UserDocument } from '../types/mongo.user.document.js';
import { ObjectId } from 'mongodb';

export const toUserDocument = (user: User): UserDocument => {
    return {
        _id: new ObjectId(user.id),
        email: user.email,
        passwordHash: user.passwordHash,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export const toUser = (document: UserDocument): User => {
    return {
        id: document._id.toString(),
        email: document.email,
        passwordHash: document.passwordHash,
        isEmailVerified: document.isEmailVerified,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
    };
};
