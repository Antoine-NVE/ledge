import type { Logger as PinoInstance } from 'pino';
import type { Logger } from '../../domain/ports/logger.js';

export class PinoLogger implements Logger {
    constructor(private pinoInstance: PinoInstance) {}

    fatal = (...args: [msg: string] | [obj: Record<string, unknown>, msg?: string]) => {
        if (typeof args[0] === 'string') this.pinoInstance.fatal(args[0]);
        else this.pinoInstance.fatal(args[0], args[1]);
    };

    error = (...args: [msg: string] | [obj: Record<string, unknown>, msg?: string]) => {
        if (typeof args[0] === 'string') this.pinoInstance.error(args[0]);
        else this.pinoInstance.error(args[0], args[1]);
    };

    warn = (...args: [msg: string] | [obj: Record<string, unknown>, msg?: string]) => {
        if (typeof args[0] === 'string') this.pinoInstance.warn(args[0]);
        else this.pinoInstance.warn(args[0], args[1]);
    };

    info = (...args: [msg: string] | [obj: Record<string, unknown>, msg?: string]) => {
        if (typeof args[0] === 'string') this.pinoInstance.info(args[0]);
        else this.pinoInstance.info(args[0], args[1]);
    };

    debug = (...args: [msg: string] | [obj: Record<string, unknown>, msg?: string]) => {
        if (typeof args[0] === 'string') this.pinoInstance.debug(args[0]);
        else this.pinoInstance.debug(args[0], args[1]);
    };

    child = (bindings: Record<string, unknown>): Logger => {
        return new PinoLogger(this.pinoInstance.child(bindings));
    };
}
