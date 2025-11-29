import { BaseLogger } from 'pino';

export const step = async <T>(
    name: string,
    pinoBaseLogger: BaseLogger,
    fn: () => Promise<T>,
): Promise<T> => {
    try {
        const result = await fn();
        pinoBaseLogger.info(name + ' succeeded');
        return result;
    } catch (err) {
        return stop(pinoBaseLogger, name, err); // Return nothing
    }
};

export const stop = (
    pinoBaseLogger: BaseLogger,
    stepName: string,
    err: unknown,
) => {
    pinoBaseLogger.fatal({ err }, `${stepName} failed`);
    process.exit(1);
};
