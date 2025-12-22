import { Logger } from '../../application/ports/logger';

export const step = async <T>(name: string, logger: Logger, fn: () => Promise<T>): Promise<T> => {
    try {
        const result = await fn();
        logger.info(name + ' succeeded');
        return result;
    } catch (err) {
        logger.fatal(`${name} failed`, { err });
        process.exit(1);
    }
};
