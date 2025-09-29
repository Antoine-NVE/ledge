import { HttpError } from './HttpError';

export abstract class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class InvalidCredentialsError extends UnauthorizedError {
    constructor() {
        super('Invalid email or password');
    }
}

export class RequiredAccessTokenError extends UnauthorizedError {
    constructor() {
        super('Access token is required');
    }
}

export class InvalidJwtError extends UnauthorizedError {
    constructor() {
        super('Invalid JWT');
    }
}

export class RequiredRefreshTokenError extends UnauthorizedError {
    constructor() {
        super('Refresh token is required');
    }
}

// Can be used when the refresh token doesn't exist in the database
export class InvalidRefreshTokenError extends UnauthorizedError {
    constructor() {
        super('Invalid refresh token');
    }
}

export class ExpiredRefreshTokenError extends UnauthorizedError {
    constructor() {
        super('Refresh token has expired');
    }
}
