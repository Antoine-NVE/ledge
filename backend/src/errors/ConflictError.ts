import { HttpError } from './HttpError';

export abstract class ConflictError extends HttpError {
    constructor(message: string) {
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
