import { Request, Response } from 'express';
import { User } from '../../../src/domain/user/user-types';
import { UserOrchestrator } from '../../../src/application/user/user-orchestrator';
import { UserController } from '../../../src/presentation/user/user-controller';
import { removePasswordHash } from '../../../src/infrastructure/utils/clean-utils';
import { Logger } from 'pino';
import { ObjectId } from 'mongodb';

jest.mock('../../../src/infrastructure/utils/clean-utils');

describe('UserController', () => {
    const USER_ID = new ObjectId();
    const URL = 'https://example.com';
    const JWT = 'json.web.token';
    const EMAIL = 'test@example.com';
    const PASSWORD_HASH = 'abc123';

    let removePasswordHashMock: jest.Mock;

    let userMock: Partial<User>;
    let reqMock: Partial<Request>;
    let resMock: Partial<Response>;
    let userOrchestratorMock: Partial<UserOrchestrator>;
    let loggerMock: Partial<Logger>;

    let userController: UserController;

    beforeEach(() => {
        removePasswordHashMock = removePasswordHash as jest.Mock;
        removePasswordHashMock.mockReturnValue({
            email: EMAIL,
        });

        userMock = {
            _id: USER_ID,
            email: EMAIL,
            passwordHash: PASSWORD_HASH,
        };
        reqMock = {};
        resMock = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        userOrchestratorMock = {
            sendVerificationEmail: jest.fn(),
            verifyEmail: jest.fn().mockResolvedValue(userMock),
        };
        loggerMock = {
            info: jest.fn(),
        };

        userController = new UserController(
            userOrchestratorMock as UserOrchestrator,
            loggerMock as Logger,
        );
    });

    describe('sendVerificationEmail', () => {
        beforeEach(() => {
            reqMock.user = userMock as User;

            reqMock.body = {
                frontendBaseUrl: URL,
            };
        });

        it('should call userOrchestrator.sendVerificationEmail with valid parameters', async () => {
            await userController.sendVerificationEmail(
                reqMock as Request,
                resMock as Response,
            );

            expect(
                userOrchestratorMock.sendVerificationEmail,
            ).toHaveBeenCalledWith(userMock, URL);
        });

        it('should call res.status().json() with valid parameters', async () => {
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
                jwt: JWT,
            };
        });

        it('should call userOrchestrator.verifyEmail with valid parameters', async () => {
            await userController.verifyEmail(
                reqMock as Request,
                resMock as Response,
            );

            expect(userOrchestratorMock.verifyEmail).toHaveBeenCalledWith(JWT);
        });

        it('should call res.status().json() with valid parameters', async () => {
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
            reqMock.user = userMock as User;
        });

        it('should call res.status().json() with valid parameters', () => {
            userController.me(reqMock as Request, resMock as Response);

            expect(removePasswordHashMock).toHaveBeenCalledWith(userMock);
            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'User retrieved successfully',
                data: {
                    user: {
                        email: EMAIL,
                    },
                },
            });
        });
    });
});
