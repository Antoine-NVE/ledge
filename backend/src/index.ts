import { loadEnv } from './infrastructure/config/env.js';
import { createBaseLogger } from './infrastructure/config/pino.js';
import { connectToRedis } from './infrastructure/config/redis.js';
import { connectToMongo } from './infrastructure/config/mongo.js';
import { PinoLogger } from './infrastructure/adapters/pino-logger.js';
import { JwtTokenManager } from './infrastructure/adapters/jwt-token-manager.js';
import { BcryptHasher } from './infrastructure/adapters/bcrypt-hasher.js';
import { NodemailerEmailSender } from './infrastructure/adapters/nodemailer-email-sender.js';
import { connectToSmtp } from './infrastructure/config/nodemailer.js';
import { RedisCacheStore } from './infrastructure/adapters/redis-cache-store.js';
import { MongoUserRepository } from './infrastructure/repositories/mongo-user-repository.js';
import { MongoTransactionRepository } from './infrastructure/repositories/mongo-transaction-repository.js';
import { MongoRefreshTokenRepository } from './infrastructure/repositories/mongo-refresh-token-repository.js';
import { createHttpApp } from './presentation/http/app.js';
import { buildContainer } from './presentation/container.js';
import { startServer } from './presentation/server.js';
import { fail, ok } from './core/utils/result.js';
import type { Result } from './core/types/result.js';

// .env is not verified yet, but we need a logger now
const logger = new PinoLogger(
    createBaseLogger({
        nodeEnv: process.env.NODE_ENV === 'development' ? 'development' : 'production',
        lokiUrl: process.env.LOKI_URL || 'http://loki:3100',
    }),
);

const start = async (): Promise<Result<void, Error>> => {
    const envResult = loadEnv();
    if (!envResult.success) return fail(new Error('Failed to load environment', { cause: envResult.error }));
    const { redisUrl, mongoUrl, smtpUrl, tokenSecret, emailFrom, allowedOrigins, port } = envResult.value;
    logger.info('Environment loaded');

    const redisResult = await connectToRedis({ redisUrl });
    if (!redisResult.success) return fail(new Error('Failed to connect to redis', { cause: redisResult.error }));
    const { redisClient } = redisResult.value;
    logger.info('Redis connected');

    const mongoResult = await connectToMongo({ mongoUrl });
    if (!mongoResult.success) return fail(new Error('Failed to connect to Mongo', { cause: mongoResult.error }));
    const { mongoDb } = mongoResult.value;
    logger.info('Mongo connected');

    const smtpResult = await connectToSmtp({ smtpUrl });
    if (!smtpResult.success) return fail(new Error('Failed to connect to SMTP', { cause: smtpResult.error }));
    const { smtpTransporter } = smtpResult.value;
    logger.info('SMTP connected');

    const { transactionService, authOrchestrator, userOrchestrator, tokenManager, userService } = buildContainer({
        tokenManager: new JwtTokenManager(tokenSecret),
        hasher: new BcryptHasher(),
        emailSender: new NodemailerEmailSender(smtpTransporter),
        cacheStore: new RedisCacheStore(redisClient),
        emailFrom,
        userRepository: new MongoUserRepository(mongoDb.collection('users')),
        transactionRepository: new MongoTransactionRepository(mongoDb.collection('transactions')),
        refreshTokenRepository: new MongoRefreshTokenRepository(mongoDb.collection('refreshtokens')),
    });

    const app = createHttpApp({
        allowedOrigins,
        transactionService,
        authOrchestrator,
        userOrchestrator,
        logger,
        tokenManager,
        userService,
    });

    const serverResult = await startServer({ app, port });
    if (!serverResult.success) return fail(new Error('Failed to start server', { cause: serverResult.error }));
    logger.info('Server started');

    return ok(undefined);
};

const result = await start();
if (!result.success) {
    logger.fatal(result.error.message, { err: result.error });
    process.exit(1);
}
