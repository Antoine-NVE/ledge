export interface Logger {
    fatal: (...args: [msg: string] | [obj: Record<string, unknown>, msg?: string]) => void;
    error: (...args: [msg: string] | [obj: Record<string, unknown>, msg?: string]) => void;
    warn: (...args: [msg: string] | [obj: Record<string, unknown>, msg?: string]) => void;
    info: (...args: [msg: string] | [obj: Record<string, unknown>, msg?: string]) => void;
    debug: (...args: [msg: string] | [obj: Record<string, unknown>, msg?: string]) => void;

    child: (bindings: Record<string, unknown>) => Logger;
}
