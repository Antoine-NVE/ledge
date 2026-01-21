import express from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middlewares/cors.middleware.js';
import { rateLimiterMiddleware } from './middlewares/rate-limiter.middleware.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';
import type { TokenManager } from '../../domain/ports/token-manager.js';
import type { IdManager } from '../../domain/ports/id-manager.js';
import type { RegisterUseCase } from '../../application/auth/register.use-case.js';
import type { LoginUseCase } from '../../application/auth/login.use-case.js';
import type { RefreshUseCase } from '../../application/auth/refresh.use-case.js';
import type { LogoutUseCase } from '../../application/auth/logout.use-case.js';
import type { CreateTransactionUseCase } from '../../application/transaction/create-transaction.use-case.js';
import type { GetUserTransactionsUseCase } from '../../application/transaction/get-user-transactions.use-case.js';
import type { GetTransactionUseCase } from '../../application/transaction/get-transaction.use-case.js';
import type { UpdateTransactionUseCase } from '../../application/transaction/update-transaction.use-case.js';
import type { DeleteTransactionUseCase } from '../../application/transaction/delete-transaction.use-case.js';
import type { RequestEmailVerificationUseCase } from '../../application/user/request-email-verification.use-case.js';
import type { VerifyEmailUseCase } from '../../application/user/verify-email.use-case.js';
import type { GetCurrentUserUseCase } from '../../application/user/get-current-user.use-case.js';
import { AuthController } from './controllers/auth.controller.js';
import { TransactionController } from './controllers/transaction.controller.js';
import { UserController } from './controllers/user.controller.js';
import { createDocsRoutes } from './routes/docs.routes.js';
import { createAuthRoutes } from './routes/auth.routes.js';
import { createTransactionRoutes } from './routes/transaction.routes.js';
import { createUserRoutes } from './routes/user.routes.js';
import type { Logger } from '../../domain/ports/logger.js';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware.js';
import type { TokenGenerator } from '../../domain/ports/token-generator.js';
import { RouteNotFoundError } from '../errors/route-not-found.error.js';

type Input = {
    logger: Logger;
    tokenManager: TokenManager;
    idManager: IdManager;
    tokenGenerator: TokenGenerator;
    registerUseCase: RegisterUseCase;
    loginUseCase: LoginUseCase;
    refreshUseCase: RefreshUseCase;
    logoutUseCase: LogoutUseCase;
    createTransactionUseCase: CreateTransactionUseCase;
    getUserTransactionsUseCase: GetUserTransactionsUseCase;
    getTransactionUseCase: GetTransactionUseCase;
    updateTransactionUseCase: UpdateTransactionUseCase;
    deleteTransactionUseCase: DeleteTransactionUseCase;
    requestEmailVerificationUseCase: RequestEmailVerificationUseCase;
    verifyEmailUseCase: VerifyEmailUseCase;
    getCurrentUserUseCase: GetCurrentUserUseCase;
    allowedOrigins: string[];
};

export const createHttpApp = ({
    logger,
    tokenManager,
    idManager,
    tokenGenerator,
    registerUseCase,
    loginUseCase,
    refreshUseCase,
    logoutUseCase,
    createTransactionUseCase,
    getUserTransactionsUseCase,
    getTransactionUseCase,
    updateTransactionUseCase,
    deleteTransactionUseCase,
    requestEmailVerificationUseCase,
    verifyEmailUseCase,
    getCurrentUserUseCase,
    allowedOrigins,
}: Input) => {
    const app = express();

    // Logger
    app.use(requestLoggerMiddleware({ logger, tokenGenerator }));

    // Security
    app.use(corsMiddleware({ allowedOrigins }));
    app.use(rateLimiterMiddleware());

    // Parsing
    app.use(express.json());
    app.use(cookieParser());

    // Controllers
    const authController = new AuthController(registerUseCase, loginUseCase, refreshUseCase, logoutUseCase);
    const transactionController = new TransactionController(
        tokenManager,
        idManager,
        createTransactionUseCase,
        getUserTransactionsUseCase,
        getTransactionUseCase,
        updateTransactionUseCase,
        deleteTransactionUseCase,
    );
    const userController = new UserController(
        tokenManager,
        requestEmailVerificationUseCase,
        verifyEmailUseCase,
        getCurrentUserUseCase,
        allowedOrigins,
    );

    // Routes
    app.use('/docs', createDocsRoutes());
    app.use('/auth', createAuthRoutes(authController));
    app.use('/transactions', createTransactionRoutes(transactionController));
    app.use('/users', createUserRoutes(userController));
    app.use(() => {
        throw new RouteNotFoundError();
    });

    // Error handler
    app.use(errorHandlerMiddleware());

    return app;
};
