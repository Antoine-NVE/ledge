import type { Transporter } from 'nodemailer';
import type { EmailSender } from '../../application/ports/email-sender.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { ensureError } from '../../core/utils/error.js';

export class NodemailerEmailSender implements EmailSender {
    constructor(private transporter: Transporter) {}

    private send = async (options: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }): Promise<Result<void, Error>> => {
        try {
            await this.transporter.sendMail(options);

            return ok(undefined);
        } catch (err: unknown) {
            return fail(ensureError(err));
        }
    };

    sendEmailVerification = ({
        from,
        to,
        frontendBaseUrl,
        emailVerificationToken,
    }: {
        from: string;
        to: string;
        frontendBaseUrl: string;
        emailVerificationToken: string;
    }): Promise<Result<void, Error>> => {
        const subject = 'Please verify your email address';
        const html = `Click here to verify your email address: <a href="${frontendBaseUrl}/verify-email/${emailVerificationToken}">verify email</a>. This link will expire in 1 hour.`;

        return this.send({ from, to, subject, html });
    };
}
