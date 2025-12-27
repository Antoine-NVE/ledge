import { Result } from '../../core/types/result';

export interface EmailSender {
    sendVerification: ({
        from,
        to,
        frontendBaseUrl,
        token,
    }: {
        from: string;
        to: string;
        frontendBaseUrl: string;
        token: string;
    }) => Promise<Result<void, Error>>;
}
