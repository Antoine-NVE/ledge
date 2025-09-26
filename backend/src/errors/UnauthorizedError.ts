import { HttpError } from './HttpError';

export class UnauthorizedError extends HttpError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

export class InvalidCredentialsError extends UnauthorizedError {
    constructor() {
        super('Invalid email or password');
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
