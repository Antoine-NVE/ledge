import { Transporter, SentMessageInfo, createTransport } from 'nodemailer';

export class EmailService {
    private transporter: Transporter;

    constructor({
        host,
        port,
        secure,
        auth,
    }: {
        host: string;
        port: number;
        secure: boolean;
        auth: { user: string; pass: string };
    }) {
        this.transporter = createTransport({ host, port, secure, auth });
    }

    private async sendEmail(from: string, to: string, subject: string, html: string): Promise<SentMessageInfo> {
        return await this.transporter.sendMail({ from, to, subject, html });
    }

    async sendEmailVerificationEmail(from: string, to: string, frontendBaseUrl: string, jwt: string) {
        const subject = 'Please verify your email address';
        const html = `Click here to verify your email address: <a href="${frontendBaseUrl}/verify-email/${jwt}">verify email</a>. This link will expire in 1 hour.`;

        return this.sendEmail(from, to, subject, html);
    }
}
