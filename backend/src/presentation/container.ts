import type { TokenManager } from '../application/ports/token-manager.js';
import type { Hasher } from '../application/ports/hasher.js';
import type { EmailSender } from '../application/ports/email-sender.js';
import type { CacheStore } from '../application/ports/cache-store.js';
import type { UserRepository } from '../domain/user/user-repository.js';
import type { TransactionRepository } from '../domain/transaction/transaction-repository.js';
import type { RefreshTokenRepository } from '../domain/refresh-token/refresh-token-repository.js';
import { RegisterUseCase } from '../application/auth/register-use-case.js';
import type { IdGenerator } from '../application/ports/id-generator.js';
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

type Input = {
    tokenManager: TokenManager;
    hasher: Hasher;
    emailSender: EmailSender;
    cacheStore: CacheStore;
    idGenerator: IdGenerator;
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
    idGenerator,
    userRepository,
    transactionRepository,
    refreshTokenRepository,
    emailFrom,
}: Input) => {
    return {
        registerUseCase: new RegisterUseCase(userRepository, refreshTokenRepository, hasher, tokenManager, idGenerator),
        loginUseCase: new LoginUseCase(userRepository, refreshTokenRepository, hasher, tokenManager, idGenerator),
        refreshUseCase: new RefreshUseCase(refreshTokenRepository, tokenManager),
        logoutUseCase: new LogoutUseCase(refreshTokenRepository),

        createTransactionUseCase: new CreateTransactionUseCase(transactionRepository, idGenerator),
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
