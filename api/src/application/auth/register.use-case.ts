import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { SessionRepository } from '../../domain/repositories/session.repository.js';
import type { PasswordHasher } from '../../domain/ports/password-hasher.js';
import type { IdGenerator } from '../../domain/ports/id-generator.js';
import type { TokenGenerator } from '../../domain/ports/token-generator.js';
import { User } from '../../domain/entities/user.js';
import type { Session } from '../../domain/entities/session.js';

export class RegisterUseCase {
    private readonly SESSION_DURATION = 30 * 24 * 60 * 60 * 1000;
    private readonly SESSION_TOKEN_LENGTH = 64;

    constructor(
        private userRepository: UserRepository,
        private sessionRepository: SessionRepository,
        private passwordHasher: PasswordHasher,
        private idGenerator: IdGenerator,
        private tokenGenerator: TokenGenerator,
    ) {}

    execute = async (email: string, password: string) => {
        const now = new Date();

        const existing = await this.userRepository.findByEmail(email);
        if (existing) return { success: false, code: 'DUPLICATE_EMAIL' } as const;

        const result = await User.register(this.idGenerator.generate(), email, password, this.passwordHasher);
        if (!result.success) return result;
        const user = result.data;

        await this.userRepository.create(user);

        const session: Session = {
            id: this.idGenerator.generate(),
            userId: user.id,
            token: this.tokenGenerator.generate(this.SESSION_TOKEN_LENGTH),
            expiresAt: new Date(now.getTime() + this.SESSION_DURATION),
            createdAt: now,
            updatedAt: now,
        };
        await this.sessionRepository.create(session);

        return { success: true, data: { ...session, user } } as const;
    };
}
