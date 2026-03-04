import { loadEnv } from './infrastructure/config/env.js';
import { createBaseLogger } from './infrastructure/config/pino.js';
import { connectToRedis } from './infrastructure/config/redis.js';
import { connectToMongo } from './infrastructure/config/mongo.js';
import { PinoLogger } from './infrastructure/adapters/pino.logger.js';
import { JwtTokenManager } from './infrastructure/adapters/jwt.token-manager.js';
import { BcryptHasher } from './infrastructure/adapters/bcrypt.hasher.js';
import { NodemailerEmailSender } from './infrastructure/adapters/nodemailer.email-sender.js';
import { connectToSmtp } from './infrastructure/config/nodemailer.js';
import { RedisCacheStore } from './infrastructure/adapters/redis.cache-store.js';
import { MongoUserRepository } from './infrastructure/repositories/mongo.user.repository.js';
import { MongoTransactionRepository } from './infrastructure/repositories/mongo.transaction.repository.js';
import { MongoRefreshTokenRepository } from './infrastructure/repositories/mongo.refresh-token.repository.js';
import { createHttpApp } from './presentation/http/app.js';
import { buildContainer } from './presentation/container.js';
import { startServer } from './presentation/server.js';
import { MongoIdManager } from './infrastructure/adapters/mongo.id-manager.js';
import { CryptoTokenGenerator } from './infrastructure/adapters/crypto.token-generator.js';

const logger = new PinoLogger(
    createBaseLogger({
        nodeEnv: process.env.NODE_ENV === 'development' ? 'development' : 'production',
        lokiUrl: process.env.LOKI_URL || 'http://loki:3100',
    }),
);

const start = async () => {
    const { redisUrl, mongoUrl, smtpUrl, tokenSecret, emailFrom, allowedOrigins, port } = loadEnv();
    logger.info('Environment loaded');

    const { redisClient } = await connectToRedis({ redisUrl });
    logger.info('Redis connected');

    const { mongoClient, mongoDb } = await connectToMongo({ mongoUrl });
    logger.info('Mongo connected');

    const { smtpTransporter } = await connectToSmtp({ smtpUrl });
    logger.info('SMTP connected');

    const idManager = new MongoIdManager();
    const tokenManager = new JwtTokenManager(tokenSecret);
    const tokenGenerator = new CryptoTokenGenerator();

    const container = buildContainer({
        tokenManager,
        hasher: new BcryptHasher(),
        emailSender: new NodemailerEmailSender(smtpTransporter),
        cacheStore: new RedisCacheStore(redisClient),
        idManager,
        tokenGenerator,
        userRepository: new MongoUserRepository(mongoDb.collection('users')),
        transactionRepository: new MongoTransactionRepository(mongoDb.collection('transactions')),
        refreshTokenRepository: new MongoRefreshTokenRepository(mongoDb.collection('refreshtokens')),
        emailFrom,
    });

    const app = createHttpApp({
        logger,
        tokenManager,
        idManager,
        tokenGenerator,
        ...container,
        allowedOrigins,
    });

    const { server } = await startServer({ app, port });
    logger.info('Server started');

    const gracefulShutdown = async (signal: 'SIGINT' | 'SIGTERM') => {
        logger.info(`Received ${signal}. Starting graceful shutdown...`);

        try {
            await new Promise<void>((resolve, reject) => {
                server.close((err?: Error) => (err ? reject(err) : resolve()));
            });
            logger.info('HTTP server closed');

            await mongoClient.close();
            logger.info('Mongo disconnected');

            await redisClient.quit();
            logger.info('Redis disconnected');

            smtpTransporter.close();
            logger.info('SMTP disconnected');

            logger.info('Graceful shutdown completed successfully. Exiting.');
            process.exit(0);
        } catch (err) {
            logger.fatal('Error during graceful shutdown', { err });
            process.exit(1);
        }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
};

try {
    await start();
} catch (error) {
    logger.fatal(error instanceof Error ? error.message : 'Unknown error', { err: error });
    process.exit(1);
}
