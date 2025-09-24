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

export class InvalidJwtError extends UnauthorizedError {
    constructor(message: string = 'Invalid JWT') {
        super(message);
        this.name = 'InvalidJwtError';
    }
}
