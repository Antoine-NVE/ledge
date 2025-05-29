jest.mock('../../models/User', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
    },
}));

import UserModel from '../../models/User';
import { isEmailValid, isPasswordValid, isEmailUnique } from '../../validators/user';

describe('User Validators', () => {
    describe('isEmailValid', () => {
        it('should return true for a valid email', () => {
            expect(isEmailValid('antoine@gmail.com')).toBe(true);
        });

        it('should return false for an email without a domain', () => {
            expect(isEmailValid('antoine@gmail')).toBe(false);
        });

        it('should return false for an empty email', () => {
            expect(isEmailValid('')).toBe(false);
        });
    });

    describe('isPasswordValid', () => {
        it('should accept a compliant password', () => {
            expect(isPasswordValid('Abcdef1!')).toBe(true);
        });

        it('should reject if missing an uppercase letter', () => {
            expect(isPasswordValid('abcdef1!')).toBe(false);
        });

        it('should reject if missing a digit', () => {
            expect(isPasswordValid('Abcdefgh!')).toBe(false);
        });

        it('should reject if too short', () => {
            expect(isPasswordValid('A1!a')).toBe(false);
        });
    });

    describe('isEmailUnique (async)', () => {
        const findOneMock = UserModel.findOne as jest.Mock;

        beforeEach(() => {
            findOneMock.mockReset();
        });

        it('should return true if no user exists', async () => {
            findOneMock.mockReturnValueOnce(null);
            await expect(isEmailUnique('new@example.com')).resolves.toBe(true);
            expect(findOneMock).toHaveBeenCalledWith({ email: 'new@example.com' });
        });

        it('should return false if the email already exists', async () => {
            findOneMock.mockReturnValueOnce({ _id: '123', email: 'exists@example.com' });
            await expect(isEmailUnique('exists@example.com')).resolves.toBe(false);
        });
    });
});
