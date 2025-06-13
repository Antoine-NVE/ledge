import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp',
    port: 1025,
    secure: false,
});

export const sendEmail = async (
    to: string,
    subject: string,
    html: string,
): Promise<[nodemailer.SentMessageInfo | null, Error | null]> => {
    const mailOptions = {
        from: '"Ledge" <no-reply@ledge.com>',
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return [info, null];
    } catch (error) {
        return [null, error as Error];
    }
};
