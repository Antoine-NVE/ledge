import { Logger } from 'pino';

export const step = async <T>(
    name: string,
    logger: Logger,
    fn: () => Promise<T>,
): Promise<T> => {
    try {
        const result = await fn();
        logger.info(name + ' succeeded');
        return result;
    } catch (err) {
        return stop(logger, name, err); // Return nothing
    }
};

export const stop = (logger: Logger, stepName: string, err: unknown) => {
    logger.fatal({ err }, `${stepName} failed`);
    process.exit(1);
};
