import type { TokenManager } from '../application/ports/token-manager.js';
import type { Hasher } from '../application/ports/hasher.js';
import type { EmailSender } from '../application/ports/email-sender.js';
import type { CacheStore } from '../application/ports/cache-store.js';
import type { UserRepository } from '../domain/user/user-repository.js';
import type { TransactionRepository } from '../domain/transaction/transaction-repository.js';
import type { RefreshTokenRepository } from '../domain/refresh-token/refresh-token-repository.js';
import { UserService } from '../domain/user/user-service';
import { RefreshTokenService } from '../domain/refresh-token/refresh-token-service';
import { TransactionService } from '../domain/transaction/transaction-service';
import { AuthOrchestrator } from '../application/auth/auth-orchestrator';
import { UserOrchestrator } from '../application/user/user-orchestrator';

export const buildContainer = ({
    tokenManager,
    hasher,
    emailSender,
    cacheStore,
    emailFrom,
    userRepository,
    transactionRepository,
    refreshTokenRepository,
}: {
    tokenManager: TokenManager;
    hasher: Hasher;
    emailSender: EmailSender;
    cacheStore: CacheStore;
    emailFrom: string;
    userRepository: UserRepository;
    transactionRepository: TransactionRepository;
    refreshTokenRepository: RefreshTokenRepository;
}) => {
    const userService = new UserService(userRepository);
    const refreshTokenService = new RefreshTokenService(refreshTokenRepository);
    const transactionService = new TransactionService(transactionRepository);

    const authOrchestrator = new AuthOrchestrator(userRepository, tokenManager, refreshTokenRepository, hasher);
    const userOrchestrator = new UserOrchestrator(tokenManager, emailSender, userService, cacheStore, emailFrom);

    return {
        transactionService,
        authOrchestrator,
        userOrchestrator,
        tokenManager,
        userService,
    };
};
