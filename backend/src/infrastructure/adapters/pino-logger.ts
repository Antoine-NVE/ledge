import type { Logger as BaseLogger } from 'pino';
import type { Logger } from '../../application/ports/logger.js';

export class PinoLogger implements Logger {
    constructor(private baseLogger: BaseLogger) {}

    fatal(message: string, meta?: Record<string, unknown>): void {
        this.baseLogger.fatal(meta, message);
    }

    error(message: string, meta?: Record<string, unknown>): void {
        this.baseLogger.error(meta, message);
    }

    warn(message: string, meta?: Record<string, unknown>): void {
        this.baseLogger.warn(meta, message);
    }

    info(message: string, meta?: Record<string, unknown>): void {
        this.baseLogger.info(meta, message);
    }

    debug(message: string, meta?: Record<string, unknown>): void {
        this.baseLogger.debug(meta, message);
    }

    child(bindings: Record<string, unknown>): Logger {
        return new PinoLogger(this.baseLogger.child(bindings));
    }
}
