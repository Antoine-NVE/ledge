import { HttpError } from './HttpError';

export abstract class UnauthorizedError extends HttpError {
    constructor(message: string, action?: string) {
        super(message, 401, undefined, action);
    }
}

export class InvalidCredentialsError extends UnauthorizedError {
    constructor() {
        super('Invalid email or password');
    }
}

export class RequiredAccessTokenError extends UnauthorizedError {
    constructor(action?: string) {
        super('Access token is required', action);
    }
}

export class InvalidJwtError extends UnauthorizedError {
    constructor() {
        super('Invalid JWT');
    }
}

export class InactiveJwtError extends UnauthorizedError {
    constructor() {
        super('JWT is not active');
    }
}

export class ExpiredJwtError extends UnauthorizedError {
    constructor(action?: string) {
        super('JWT has expired', action);
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
