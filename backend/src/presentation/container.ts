import { Logger } from '../application/ports/logger';
import { TokenManager } from '../application/ports/token-manager';
import { Hasher } from '../application/ports/hasher';
import { EmailSender } from '../application/ports/email-sender';
import { CacheStore } from '../application/ports/cache-store';
import { UserRepository } from '../domain/user/user-repository';
import { TransactionRepository } from '../domain/transaction/transaction-repository';
import { RefreshTokenRepository } from '../domain/refresh-token/refresh-token-repository';
import { UserService } from '../domain/user/user-service';
import { RefreshTokenService } from '../domain/refresh-token/refresh-token-service';
import { TransactionService } from '../domain/transaction/transaction-service';
import { AuthOrchestrator } from '../application/auth/auth-orchestrator';
import { UserOrchestrator } from '../application/user/user-orchestrator';

export const buildContainer = ({
    logger,
    tokenManager,
    hasher,
    emailSender,
    cacheStore,
    emailFrom,
    userRepository,
    transactionRepository,
    refreshTokenRepository,
}: {
    logger: Logger;
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

    const authOrchestrator = new AuthOrchestrator(
        userService,
        tokenManager,
        refreshTokenService,
        hasher,
    );
    const userOrchestrator = new UserOrchestrator(
        tokenManager,
        emailSender,
        userService,
        cacheStore,
        emailFrom,
    );

    return {
        logger,
        transactionService,
        authOrchestrator,
        userOrchestrator,
        tokenManager,
        userService,
    };
};
