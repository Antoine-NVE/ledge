import { HttpError } from './HttpError';

export class ConflictError extends HttpError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
    }
}

export class EmailAlreadyExistsError extends ConflictError {
    constructor() {
        super('Email already exists');
    }
}

export class EmailAlreadyVerifiedError extends ConflictError {
    constructor() {
        super('Email already verified');
    }
}
