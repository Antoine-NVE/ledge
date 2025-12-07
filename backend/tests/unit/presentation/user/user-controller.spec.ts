import { Request, Response } from 'express';
import { Logger } from 'pino';
import { User } from '../../../../src/domain/user/user-types';
import { UserOrchestrator } from '../../../../src/application/user/user-orchestrator';
import { UserController } from '../../../../src/presentation/http/user/user-controller';
import * as cleanUtils from '../../../../src/core/utils/clean';

declare module 'express-serve-static-core' {
    interface Request {
        user: User;
    }
}

describe('UserController', () => {
    const USER_ID = 'USERID123';
    const URL = 'https://example.com';
    const TOKEN = 'token';
    const EMAIL = 'test@example.com';
    const PASSWORD_HASH = 'pAsSwOrDhAsH';

    let user: Partial<User>;
    let cleanUser: Partial<Omit<User, 'passwordHash'>>;

    let reqMock: Partial<Request>;
    let resMock: Partial<Response>;
    let userOrchestratorMock: Partial<UserOrchestrator>;
    let loggerMock: Partial<Logger>;

    let removePasswordHashSpy: jest.SpiedFunction<
        typeof cleanUtils.removePasswordHash
    >;

    let userController: UserController;

    beforeEach(() => {
        user = {
            id: USER_ID,
            email: EMAIL,
            passwordHash: PASSWORD_HASH,
        };
        cleanUser = {
            id: USER_ID,
            email: EMAIL,
        };

        reqMock = {};
        resMock = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        userOrchestratorMock = {
            sendVerificationEmail: jest.fn(),
            verifyEmail: jest.fn().mockResolvedValue({ user }),
        };
        loggerMock = {
            info: jest.fn(),
        };

        removePasswordHashSpy = jest
            .spyOn(cleanUtils, 'removePasswordHash')
            .mockReturnValue(cleanUser as Omit<User, 'passwordHash'>);

        userController = new UserController(
            userOrchestratorMock as UserOrchestrator,
            loggerMock as Logger,
        );
    });

    describe('sendVerificationEmail', () => {
        beforeEach(() => {
            reqMock.user = user as User;

            reqMock.body = {
                frontendBaseUrl: URL,
            };
        });

        it('should call this.userOrchestrator.sendVerificationEmail', async () => {
            await userController.sendVerificationEmail(
                reqMock as Request,
                resMock as Response,
            );

            expect(
                userOrchestratorMock.sendVerificationEmail,
            ).toHaveBeenCalledWith({
                user,
                frontendBaseUrl: URL,
            });
        });

        it('should call res.status and res.json', async () => {
            await userController.sendVerificationEmail(
                reqMock as Request,
                resMock as Response,
            );

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'Verification email sent successfully',
            });
        });
    });

    describe('verifyEmail', () => {
        beforeEach(() => {
            reqMock.body = {
                token: TOKEN,
            };
        });

        it('should call this.userOrchestrator.verifyEmail', async () => {
            await userController.verifyEmail(
                reqMock as Request,
                resMock as Response,
            );

            expect(userOrchestratorMock.verifyEmail).toHaveBeenCalledWith({
                token: TOKEN,
            });
        });

        it('should call res.status and res.json', async () => {
            await userController.verifyEmail(
                reqMock as Request,
                resMock as Response,
            );

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'Email verified successfully',
            });
        });
    });

    describe('me', () => {
        beforeEach(() => {
            reqMock.user = user as User;
        });

        it('should call res.status().json() with valid parameters', () => {
            userController.me(reqMock as Request, resMock as Response);

            expect(removePasswordHashSpy).toHaveBeenCalledWith(user);
            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'User retrieved successfully',
                data: {
                    user: {
                        id: USER_ID,
                        email: EMAIL,
                    },
                },
            });
        });
    });
});
