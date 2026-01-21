export abstract class BaseError<C extends string> extends Error {
    protected constructor(
        public readonly code: C,
        defaultMessage: string,
        options?: ErrorOptions & { message?: string },
    ) {
        super(options?.message ?? defaultMessage, { cause: options?.cause });
        this.name = this.constructor.name;
    }
}
