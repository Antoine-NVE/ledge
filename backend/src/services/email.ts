import nodemailer from 'nodemailer';

export const sendEmail = async (
    to: string,
    subject: string,
    html: string,
): Promise<[nodemailer.SentMessageInfo | null, Error | null]> => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const emailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(emailOptions);
        return [info, null];
    } catch (error) {
        return [null, error as Error];
    }
};
