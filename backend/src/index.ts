import { createApp } from './presentation/app';
import { buildContainer } from './infrastructure/config/container';
import { loadEnv } from './infrastructure/config/env';
import { createLogger } from './infrastructure/config/pino';
import { step, stop } from './infrastructure/utils/lifecycle';
import { connectToRedis } from './infrastructure/config/redis';
import { connectToMongo } from './infrastructure/config/mongo';
import { PinoLogger } from './infrastructure/adapters/pino-logger';
import { JwtTokenManager } from './infrastructure/adapters/jwt-token-manager';
import { BcryptHasher } from './infrastructure/adapters/bcrypt-hasher';
import { NodemailerEmailSender } from './infrastructure/adapters/nodemailer-email-sender';
import { connectToSmtp } from './infrastructure/config/nodemailer';
import { RedisCacheStore } from './infrastructure/adapters/redis-cache-store';

const start = async () => {
    // .env is not verified yet, but we need a logger now
    const pinoLogger = createLogger(
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
    );

    const env = await step('Environment validation', pinoLogger, async () => {
        return loadEnv();
    });

    const redisClient = await step('Redis connection', pinoLogger, async () => {
        return await connectToRedis();
    });

    const { db: mongoDb } = await step(
        'Mongo connection',
        pinoLogger,
        async () => {
            return await connectToMongo();
        },
    );

    const nodemailerTransporter = await step(
        'SMTP connection',
        pinoLogger,
        async () => {
            return await connectToSmtp({
                host: env.SMTP_HOST,
                port: env.SMTP_PORT,
                secure: env.SMTP_SECURE,
                auth: {
                    user: env.SMTP_USER,
                    pass: env.SMTP_PASS,
                },
            });
        },
    );

    const container = buildContainer(
        mongoDb,
        new PinoLogger(pinoLogger),
        new JwtTokenManager(env.JWT_SECRET),
        new BcryptHasher(),
        new NodemailerEmailSender(nodemailerTransporter),
        new RedisCacheStore(redisClient),
        env.EMAIL_FROM,
    );

    const app = createApp(
        { allowedOrigins: env.ALLOWED_ORIGINS, nodeEnv: env.NODE_ENV },
        container,
        pinoLogger,
    );
    const server = app.listen(3000);
    server.on('listening', () => {
        pinoLogger.info('Server started');
    });
    server.on('error', (err) => {
        stop(pinoLogger, 'Server startup', err);
    });
};

start().then();
