import { Transporter, SentMessageInfo, createTransport } from 'nodemailer';

export const createTransporter = (
    host: string,
    port: number,
    secure: boolean,
    auth: { user: string; pass: string },
): Transporter => {
    return createTransport({
        host,
        port,
        secure,
        auth,
    });
};

// Base function, only called in this service
const sendEmail = async (
    from: string,
    to: string,
    subject: string,
    html: string,
    transporter: Transporter,
): Promise<SentMessageInfo | null> => {
    try {
        return await transporter.sendMail({ from, to, subject, html });
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const sendEmailVerificationEmail = async (
    from: string,
    to: string,
    transporter: Transporter,
    frontendBaseUrl: string,
    jwt: string,
): Promise<SentMessageInfo | null> => {
    const subject = 'Please verify your email address';
    const html = `Click here to verify your email address: <a href="${frontendBaseUrl}/verify-email/${jwt}">verify email</a>. This link will expire in 1 hour.`;

    return await sendEmail(from, to, subject, html, transporter);
};
