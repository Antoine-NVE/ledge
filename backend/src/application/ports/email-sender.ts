import type { Result } from '../../core/types/result.js';

export interface EmailSender {
    sendEmailVerification: ({
        from,
        to,
        frontendBaseUrl,
        emailVerificationToken,
    }: {
        from: string;
        to: string;
        frontendBaseUrl: string;
        emailVerificationToken: string;
    }) => Promise<Result<void, Error>>;
}
