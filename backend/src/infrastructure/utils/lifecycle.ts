import { Logger } from 'pino';

export const step = async <T>(
    name: string,
    logger: Logger,
    fn: () => Promise<T>,
): Promise<T> => {
    try {
        return await fn();
    } catch (err) {
        return stop(logger, name, err); // Return nothing
    }
};

export const stop = (logger: Logger, stepName: string, err: unknown) => {
    logger.fatal({ err }, `${stepName} failed`);
    process.exit(1);
};
