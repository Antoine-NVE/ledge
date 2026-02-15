import type { Router } from 'express';
import type { RegisterUseCase } from '../../../application/auth/register.use-case.js';
import type { LoginUseCase } from '../../../application/auth/login.use-case.js';
import type { RefreshUseCase } from '../../../application/auth/refresh.use-case.js';
import type { LogoutUseCase } from '../../../application/auth/logout.use-case.js';
import { registerRoute } from './auth/register.route.js';
import { loginRoute } from './auth/login.route.js';
import { refreshRoute } from './auth/refresh.route.js';
import { logoutRoute } from './auth/logout.route.js';
import { createTransactionRoute } from './transaction/create.route.js';
import type { CreateTransactionUseCase } from '../../../application/transaction/create-transaction.use-case.js';
import type { GetUserTransactionsUseCase } from '../../../application/transaction/get-user-transactions.use-case.js';
import type { GetTransactionUseCase } from '../../../application/transaction/get-transaction.use-case.js';
import type { UpdateTransactionUseCase } from '../../../application/transaction/update-transaction.use-case.js';
import type { DeleteTransactionUseCase } from '../../../application/transaction/delete-transaction.use-case.js';
import { readAllTransactionRoute } from './transaction/read-all.route.js';
import type { TokenManager } from '../../../domain/ports/token-manager.js';
import type { IdManager } from '../../../domain/ports/id-manager.js';
import { readTransactionRoute } from './transaction/read.route.js';
import { updateTransactionRoute } from './transaction/update.route.js';
import { deleteTransactionRoute } from './transaction/delete.route.js';
import type { RequestEmailVerificationUseCase } from '../../../application/user/request-email-verification.use-case.js';
import type { VerifyEmailUseCase } from '../../../application/user/verify-email.use-case.js';
import type { GetCurrentUserUseCase } from '../../../application/user/get-current-user.use-case.js';
import { requestEmailVerificationRoute } from './user/request-email-verification.route.js';
import { verifyEmailRoute } from './user/verify-email.route.js';
import { meRoute } from './user/me.route.js';
import { docsRoute } from './docs/docs.route.js';
import type { Env } from '../../../infrastructure/config/env.js';

type Deps = {
    tokenManager: TokenManager;
    idManager: IdManager;

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

    allowedOrigins: Env['allowedOrigins'];
};

export const routes = (
    router: Router,
    {
        tokenManager,
        idManager,

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
    }: Deps,
) => {
    registerRoute(router, { registerUseCase });
    loginRoute(router, { loginUseCase });
    refreshRoute(router, { refreshUseCase });
    logoutRoute(router, { logoutUseCase });

    docsRoute(router);

    createTransactionRoute(router, { createTransactionUseCase, tokenManager });
    readAllTransactionRoute(router, { getUserTransactionsUseCase, tokenManager });
    readTransactionRoute(router, { getTransactionUseCase, tokenManager, idManager });
    updateTransactionRoute(router, { updateTransactionUseCase, tokenManager, idManager });
    deleteTransactionRoute(router, { deleteTransactionUseCase, tokenManager, idManager });

    requestEmailVerificationRoute(router, { requestEmailVerificationUseCase, tokenManager, allowedOrigins });
    verifyEmailRoute(router, { verifyEmailUseCase });
    meRoute(router, { getCurrentUserUseCase, tokenManager });

    return router;
};
