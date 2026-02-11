import type { User } from '../../src/domain/entities/user';

export const fakeUser = (overrides: Partial<User> = {}): User => {
    return {
        id: '507f1f77bcf86cd799439011',
        email: 'john.doe@example.com',
        passwordHash: 'hashed_password_123',
        isEmailVerified: true,
        createdAt: new Date('2025-01-01T10:00:00.000Z'),
        updatedAt: new Date('2026-01-01T10:00:00.000Z'),
        ...overrides,
    };
};
