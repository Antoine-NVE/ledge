import { EmailService } from '../../services/EmailService';
import nodemailer from 'nodemailer';

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(),
}));

describe('EmailService', () => {
    let emailService: EmailService;
    const host = 'smtp.example.com';
    const port = 587;
    const secure = false;
    const auth = { user: 'testuser', pass: 'testpass' };
    const from = 'test@example.com';

    beforeEach(() => {
        jest.clearAllMocks();

        emailService = new EmailService(host, port, secure, auth, from);
    });

    describe('constructor', () => {
        it('should called createTransport with correct params', () => {
            expect(nodemailer.createTransport).toHaveBeenCalledWith({
                host,
                port,
                secure,
                auth,
            });
        });
    });

    describe('sendVerification', () => {
        it('should call sendMail with correct params', async () => {
            jest.spyOn(emailService as any, 'send').mockResolvedValue({});

            const to = 'example@example.com';
            const frontendBaseUrl = 'http://frontend.example.com';
            const jwt = 'test-jwt-token';
            await emailService.sendVerification(to, frontendBaseUrl, jwt);

            expect(emailService['send']).toHaveBeenCalledWith(
                to,
                expect.stringContaining('verify your email'),
                expect.stringContaining(
                    `${frontendBaseUrl}/verify-email/${jwt}`,
                ),
            );
        });
    });
});
