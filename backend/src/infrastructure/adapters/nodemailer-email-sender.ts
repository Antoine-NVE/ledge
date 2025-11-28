import { Transporter } from 'nodemailer';
import { EmailSender } from '../../application/ports/email-sender';

export class NodemailerEmailSender implements EmailSender {
    constructor(private transporter: Transporter) {}

    private send = async (options: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }): Promise<void> => {
        await this.transporter.sendMail(options);
    };

    sendVerification = async (
        options: {
            from: string;
            to: string;
        },
        frontendBaseUrl: string,
        token: string,
    ): Promise<void> => {
        const subject = 'Please verify your email address';
        const html = `Click here to verify your email address: <a href="${frontendBaseUrl}/verify-email/${token}">verify email</a>. This link will expire in 1 hour.`;

        await this.send({ ...options, subject, html });
    };
}
