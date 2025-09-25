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

export class RequiredRefreshTokenError extends UnauthorizedError {
    constructor(message: string = 'Refresh token is required') {
        super(message);
        this.name = 'RequiredRefreshTokenError';
    }
}

export class InvalidRefreshTokenError extends UnauthorizedError {
    constructor(message: string = 'Invalid refresh token') {
        super(message);
        this.name = 'InvalidRefreshTokenError';
    }
}

export class ExpiredRefreshTokenError extends UnauthorizedError {
    constructor(message: string = 'Refresh token has expired') {
        super(message);
        this.name = 'ExpiredRefreshTokenError';
    }
}
