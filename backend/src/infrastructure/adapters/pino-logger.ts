import { Logger as LoggerType } from 'pino';
import { Logger } from '../../application/ports/logger';

export class PinoLogger implements Logger {
    constructor(private logger: LoggerType) {}

    fatal(message: string, meta?: unknown): void {
        this.logger.fatal(meta, message);
    }

    error(message: string, meta?: unknown): void {
        this.logger.error(meta, message);
    }

    warn(message: string, meta?: unknown): void {
        this.logger.warn(meta, message);
    }

    info(message: string, meta?: unknown): void {
        this.logger.info(meta, message);
    }

    debug(message: string, meta?: unknown): void {
        this.logger.debug(meta, message);
    }
}
