import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import { UserRepository } from '../../domain/user/user-repository';
import { AuthOrchestrator } from '../../application/auth/auth-orchestrator';
import { TransactionService } from '../../domain/transaction/transaction-service';
import { UserService } from '../../domain/user/user-service';
import { AuthController } from '../../presentation/auth/auth-controller';
import { UserController } from '../../presentation/user/user-controller';
import { TransactionController } from '../../presentation/transaction/transaction-controller';
import { UserOrchestrator } from '../../application/user/user-orchestrator';
import { RefreshTokenService } from '../../domain/refresh-token/refresh-token-service';
import { createAuthenticate } from '../../presentation/middlewares/business/auth/authenticate';
import { createAuthorize } from '../../presentation/middlewares/business/auth/authorize';
import { Logger } from '../../application/ports/logger';
import { TokenManager } from '../../application/ports/token-manager';
import { Hasher } from '../../application/ports/hasher';
import { EmailSender } from '../../application/ports/email-sender';
import { CacheStore } from '../../application/ports/cache-store';

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

    const authController = new AuthController(authOrchestrator, logger);
    const userController = new UserController(userOrchestrator, logger);
    const transactionController = new TransactionController(
        transactionService,
        logger,
    );

    const authenticate = createAuthenticate(tokenManager, userService);
    const authorize = createAuthorize(transactionService);

    return {
        logger,
        authController,
        userController,
        transactionController,
        authenticate,
        authorize,
    };
};
