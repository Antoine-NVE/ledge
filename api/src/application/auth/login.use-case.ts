import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { SessionRepository } from '../../domain/repositories/session.repository.js';
import type { PasswordHasher } from '../../domain/ports/password-hasher.js';
import type { IdGenerator } from '../../domain/ports/id-generator.js';
import type { TokenGenerator } from '../../domain/ports/token-generator.js';
import type { Session } from '../../domain/entities/session.js';

export class LoginUseCase {
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

        const user = await this.userRepository.findByEmail(email);
        if (!user) return { success: false, code: 'USER_NOT_FOUND' } as const;

        const isPasswordCorrect = await this.passwordHasher.compare(password, user.passwordHash);
        if (!isPasswordCorrect) return { success: false, code: 'WRONG_PASSWORD' } as const;

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
