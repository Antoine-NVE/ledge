import { createApp } from './presentation/app';
import { buildContainer } from './infrastructure/config/container';
import { loadEnv } from './infrastructure/config/env';
import { createBaseLogger } from './infrastructure/config/pino';
import { step, stop } from './infrastructure/utils/lifecycle';
import { connectToRedis } from './infrastructure/config/redis';
import { connectToMongo } from './infrastructure/config/mongo';
import { PinoLogger } from './infrastructure/adapters/pino-logger';
import { JwtTokenManager } from './infrastructure/adapters/jwt-token-manager';
import { BcryptHasher } from './infrastructure/adapters/bcrypt-hasher';
import { NodemailerEmailSender } from './infrastructure/adapters/nodemailer-email-sender';
import { connectToSmtp } from './infrastructure/config/nodemailer';
import { RedisCacheStore } from './infrastructure/adapters/redis-cache-store';
import { MongoUserRepository } from './infrastructure/repositories/mongo-user-repository';
import { MongoTransactionRepository } from './infrastructure/repositories/mongo-transaction-repository';
import { MongoRefreshTokenRepository } from './infrastructure/repositories/mongo-refresh-token-repository';

const start = async () => {
    // .env is not verified yet, but we need a logger now
    const pinoBaseLogger = createBaseLogger(
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
    );

    const {
        SMTP_HOST: host,
        SMTP_PORT: port,
        SMTP_SECURE: secure,
        SMTP_AUTH: auth,
        JWT_SECRET: jwtSecret,
        EMAIL_FROM: emailFrom,
        NODE_ENV: nodeEnv,
        ALLOWED_ORIGINS: allowedOrigins,
    } = await step('Environment validation', pinoBaseLogger, async () => {
        return loadEnv();
    });

    const redisClient = await step(
        'Redis connection',
        pinoBaseLogger,
        async () => {
            return await connectToRedis();
        },
    );

    const { db: mongoDb } = await step(
        'Mongo connection',
        pinoBaseLogger,
        async () => {
            return await connectToMongo();
        },
    );

    const nodemailerTransporter = await step(
        'SMTP connection',
        pinoBaseLogger,
        async () => {
            return await connectToSmtp({
                host,
                port,
                secure,
                auth,
            });
        },
    );

    const {
        authController,
        userController,
        transactionController,
        authenticate,
        authorize,
        logger,
    } = buildContainer({
        logger: new PinoLogger(pinoBaseLogger),
        tokenManager: new JwtTokenManager(jwtSecret),
        hasher: new BcryptHasher(),
        emailSender: new NodemailerEmailSender(nodemailerTransporter),
        cacheStore: new RedisCacheStore(redisClient),
        emailFrom,
        userRepository: new MongoUserRepository(mongoDb.collection('users')),
        transactionRepository: new MongoTransactionRepository(
            mongoDb.collection('transactions'),
        ),
        refreshTokenRepository: new MongoRefreshTokenRepository(
            mongoDb.collection('refreshtokens'),
        ),
    });

    const app = createApp({
        allowedOrigins,
        nodeEnv,
        authController,
        userController,
        transactionController,
        authenticate,
        authorize,
        logger,
    });
    const server = app.listen(3000);
    server.on('listening', () => {
        pinoBaseLogger.info('Server started');
    });
    server.on('error', (err) => {
        stop(pinoBaseLogger, 'Server startup', err);
    });
};

start().then();
