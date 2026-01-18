import type { TokenManager } from '../domain/ports/token-manager.js';
import type { Hasher } from '../domain/ports/hasher.js';
import type { EmailSender } from '../domain/ports/email-sender.js';
import type { CacheStore } from '../domain/ports/cache-store.js';
import type { UserRepository } from '../domain/repositories/user.repository.js';
import type { TransactionRepository } from '../domain/repositories/transaction.repository.js';
import type { RefreshTokenRepository } from '../domain/repositories/refresh-token.repository.js';
import { RegisterUseCase } from '../application/auth/register-use-case.js';
import type { IdManager } from '../domain/ports/id-manager.js';
import { LoginUseCase } from '../application/auth/login-use-case.js';
import { RefreshUseCase } from '../application/auth/refresh-use-case.js';
import { LogoutUseCase } from '../application/auth/logout-use-case.js';
import { CreateTransactionUseCase } from '../application/transaction/create-transaction-use-case.js';
import { GetUserTransactionsUseCase } from '../application/transaction/get-user-transactions-use-case.js';
import { GetTransactionUseCase } from '../application/transaction/get-transaction-use-case.js';
import { UpdateTransactionUseCase } from '../application/transaction/update-transaction-use-case.js';
import { DeleteTransactionUseCase } from '../application/transaction/delete-transaction-use-case.js';
import { RequestEmailVerificationUseCase } from '../application/user/request-email-verification-use-case.js';
import { VerifyEmailUseCase } from '../application/user/verify-email-use-case.js';
import { GetCurrentUserUseCase } from '../application/user/get-current-user-use-case.js';
import type { TokenGenerator } from '../domain/ports/token-generator.js';

type Input = {
    tokenManager: TokenManager;
    hasher: Hasher;
    emailSender: EmailSender;
    cacheStore: CacheStore;
    idManager: IdManager;
    tokenGenerator: TokenGenerator;
    userRepository: UserRepository;
    transactionRepository: TransactionRepository;
    refreshTokenRepository: RefreshTokenRepository;
    emailFrom: string;
};

export const buildContainer = ({
    tokenManager,
    hasher,
    emailSender,
    cacheStore,
    idManager,
    tokenGenerator,
    userRepository,
    transactionRepository,
    refreshTokenRepository,
    emailFrom,
}: Input) => {
    return {
        registerUseCase: new RegisterUseCase(
            userRepository,
            refreshTokenRepository,
            hasher,
            tokenManager,
            idManager,
            tokenGenerator,
        ),
        loginUseCase: new LoginUseCase(
            userRepository,
            refreshTokenRepository,
            hasher,
            tokenManager,
            idManager,
            tokenGenerator,
        ),
        refreshUseCase: new RefreshUseCase(refreshTokenRepository, tokenManager, tokenGenerator),
        logoutUseCase: new LogoutUseCase(refreshTokenRepository),

        createTransactionUseCase: new CreateTransactionUseCase(transactionRepository, idManager),
        getUserTransactionsUseCase: new GetUserTransactionsUseCase(transactionRepository),
        getTransactionUseCase: new GetTransactionUseCase(transactionRepository),
        updateTransactionUseCase: new UpdateTransactionUseCase(transactionRepository),
        deleteTransactionUseCase: new DeleteTransactionUseCase(transactionRepository),

        requestEmailVerificationUseCase: new RequestEmailVerificationUseCase(
            userRepository,
            emailSender,
            tokenManager,
            cacheStore,
            emailFrom,
        ),
        verifyEmailUseCase: new VerifyEmailUseCase(userRepository, tokenManager),
        getCurrentUserUseCase: new GetCurrentUserUseCase(userRepository),
    };
};
