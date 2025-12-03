import { loadEnv } from './infrastructure/config/env';
import { createBaseLogger } from './infrastructure/config/pino';
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
import { createHttpApp } from './presentation/http/app';
import { buildContainer } from './presentation/container';
import { startHttpServer } from './presentation/http/server';
import { step } from './core/utils/lifecycle';

const start = async () => {
    // .env is not verified yet, but we need a logger now
    const logger = new PinoLogger(
        createBaseLogger({
            nodeEnv:
                process.env.NODE_ENV === 'production'
                    ? 'production'
                    : 'development',
        }),
    );

    const {
        smtpHost,
        smtpPort,
        smtpSecure,
        smtpAuth,
        jwtSecret,
        emailFrom,
        nodeEnv,
        allowedOrigins,
    } = await step('Environment validation', logger, async () => {
        return loadEnv();
    });

    const client = await step('Redis connection', logger, async () => {
        return await connectToRedis();
    });

    const { db } = await step('Mongo connection', logger, async () => {
        return await connectToMongo();
    });

    const transporter = await step('SMTP connection', logger, async () => {
        return await connectToSmtp({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: smtpAuth,
        });
    });

    const {
        transactionService,
        authOrchestrator,
        userOrchestrator,
        tokenManager,
        userService,
    } = await step('Container build', logger, async () => {
        return buildContainer({
            tokenManager: new JwtTokenManager(jwtSecret),
            hasher: new BcryptHasher(),
            emailSender: new NodemailerEmailSender(transporter),
            cacheStore: new RedisCacheStore(client),
            emailFrom,
            userRepository: new MongoUserRepository(db.collection('users')),
            transactionRepository: new MongoTransactionRepository(
                db.collection('transactions'),
            ),
            refreshTokenRepository: new MongoRefreshTokenRepository(
                db.collection('refreshtokens'),
            ),
        });
    });

    const app = await step('HTTP app creation', logger, async () => {
        return createHttpApp({
            allowedOrigins,
            nodeEnv,
            transactionService,
            authOrchestrator,
            userOrchestrator,
            logger,
            tokenManager,
            userService,
        });
    });

    await step('HTTP server startup', logger, async () => {
        return startHttpServer({ app });
    });
};

start().then();
