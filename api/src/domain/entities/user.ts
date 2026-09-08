import type { PasswordHasher } from '../ports/password-hasher.js';

export class User {
    private constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly passwordHash: string,
        public readonly isEmailVerified: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    // passwordHasher is injected here (instead of being called by the use case beforehand)
    // so validation and hashing always happen in order, atomically, in a single call — a
    // caller has no way to hash an invalid password by forgetting to validate it first.
    static register = async (id: string, email: string, password: string, passwordHasher: PasswordHasher) => {
        const now = new Date();

        const emailResult = User.validateEmail(email);
        if (!emailResult.success) return emailResult;

        const passwordResult = User.validatePassword(password);
        if (!passwordResult.success) return passwordResult;

        const passwordHash = await passwordHasher.hash(password);

        return {
            success: true,
            data: new User(id, email, passwordHash, false, now, now),
        } as const;
    };

    verifyEmail = (): User => {
        const now = new Date();

        return new User(this.id, this.email, this.passwordHash, true, this.createdAt, now);
    };

    private static validateEmail = (email: string) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return { success: false, code: 'INVALID_EMAIL' } as const;
        }

        return { success: true } as const;
    };

    private static validatePassword = (password: string) => {
        if (
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/\d/.test(password) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(password)
        ) {
            return { success: false, code: 'WEAK_PASSWORD' } as const;
        }

        return { success: true } as const;
    };

    static reconstitute = (
        id: string,
        email: string,
        passwordHash: string,
        isEmailVerified: boolean,
        createdAt: Date,
        updatedAt: Date,
    ) => {
        return new User(id, email, passwordHash, isEmailVerified, createdAt, updatedAt);
    };
}
