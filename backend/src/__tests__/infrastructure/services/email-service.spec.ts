import nodemailer from 'nodemailer';
import { EmailService } from '../../../infrastructure/services/email-service';

jest.mock('nodemailer');

describe('EmailService', () => {
    let sendMailMock: jest.Mock;
    let createTransportMock: jest.Mock;

    const config = {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: { user: 'user@example.com', pass: 'password' },
    };

    beforeEach(() => {
        sendMailMock = jest.fn();
        createTransportMock = nodemailer.createTransport as jest.Mock;
        createTransportMock.mockReturnValue({
            sendMail: sendMailMock,
        });
    });

    describe('constructor', () => {
        it('should call nodemailer.createTransport with provided config', () => {
            new EmailService(config);
            expect(createTransportMock).toHaveBeenCalledWith(config);
            expect(createTransportMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('sendVerification', () => {
        let emailService: EmailService;

        beforeEach(() => {
            emailService = new EmailService(config);
        });

        it('should call transporter.sendMail with correct subject and html', async () => {
            const from = 'no-reply@example.com';
            const to = 'user@example.com';
            const frontendBaseUrl = 'https://app.example.com';
            const jwt = 'token123';

            await emailService.sendVerification(from, to, frontendBaseUrl, jwt);

            expect(sendMailMock).toHaveBeenCalledTimes(1);
            expect(sendMailMock).toHaveBeenCalledWith({
                from,
                to,
                subject: 'Please verify your email address',
                html: `Click here to verify your email address: <a href="${frontendBaseUrl}/verify-email/${jwt}">verify email</a>. This link will expire in 1 hour.`,
            });
        });
    });
});
