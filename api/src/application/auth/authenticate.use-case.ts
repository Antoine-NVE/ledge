import type { SessionRepository } from '../../domain/repositories/session.repository.js';

export class AuthenticateUseCase {
    constructor(private sessionRepository: SessionRepository) {}

    execute = async (token: string) => {
        const now = new Date();

        const session = await this.sessionRepository.findByToken(token);
        if (!session) return { success: false, code: 'SESSION_NOT_FOUND' } as const;
        if (session.expiresAt < now) return { success: false, code: 'SESSION_EXPIRED' } as const;

        return { success: true, data: session } as const;
    };
}
