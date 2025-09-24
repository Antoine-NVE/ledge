export class UnauthorizedError extends Error {
    constructor(message: string = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class InvalidCredentialsError extends UnauthorizedError {
    constructor(message: string = 'Invalid email or password') {
        super(message);
        this.name = 'InvalidCredentialsError';
    }
}
