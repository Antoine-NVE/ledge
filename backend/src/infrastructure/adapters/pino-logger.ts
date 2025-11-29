import { BaseLogger } from 'pino';
import { Logger } from '../../application/ports/logger';

export class PinoLogger implements Logger {
    constructor(private baseLogger: BaseLogger) {}

    fatal(message: string, meta?: unknown): void {
        this.baseLogger.fatal(meta, message);
    }

    error(message: string, meta?: unknown): void {
        this.baseLogger.error(meta, message);
    }

    warn(message: string, meta?: unknown): void {
        this.baseLogger.warn(meta, message);
    }

    info(message: string, meta?: unknown): void {
        this.baseLogger.info(meta, message);
    }

    debug(message: string, meta?: unknown): void {
        this.baseLogger.debug(meta, message);
    }
}
