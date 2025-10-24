import { ObjectId } from 'mongodb';
import { UserRepository } from '../../domain/user/user-repository';
import { EmailService } from '../../services/email-service';
import { JwtService } from '../../services/jwt-service';
import { UserService } from '../../services/user-service';
import { parseSchema } from '../../utils/schema-utils';
import { objectIdSchema } from '../../schemas/security-schemas';
import { userSchema } from '../../schemas/user-schemas';
import { User } from '../../domain/user/user-types';

jest.mock('../../utils/schema-utils', () => ({
    parseSchema: jest.fn(),
}));

const jwt = 'json.web.token';
const userId = new ObjectId();
const payload = {
    sub: userId,
};
const email = 'test@example.com';
const passwordHash = 'password-hash';
let user = {} as unknown as User;
const frontendBaseUrl = 'http://localhost:5173';

const jwtService = {
    signEmailVerification: jest.fn().mockReturnValue(jwt),
    verifyEmailVerification: jest.fn().mockReturnValue(payload),
} as unknown as JwtService;

const emailService = {
    sendVerification: jest.fn(),
} as unknown as EmailService;

let userRepository = {} as unknown as UserRepository;

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        jest.clearAllMocks();

        user = { _id: userId, email, passwordHash } as unknown as User;

        userRepository = {
            insertOne: jest.fn().mockResolvedValue(user),
            findOne: jest.fn().mockResolvedValue(user),
            updateOne: jest.fn().mockResolvedValue(user),
        } as unknown as UserRepository;

        (parseSchema as jest.Mock).mockReturnValue(user);

        userService = new UserService(jwtService, emailService, userRepository);
    });

    describe('sendVerificationEmail', () => {
        it('should call jwtService to signEmailVerification', async () => {
            await userService.sendVerificationEmail(user, frontendBaseUrl);

            expect(jwtService.signEmailVerification).toHaveBeenCalledWith(
                userId,
            );
        });

        it('should call emailService to sendVerification', async () => {
            await userService.sendVerificationEmail(user, frontendBaseUrl);

            expect(emailService.sendVerification).toHaveBeenCalledWith(
                email,
                frontendBaseUrl,
                jwt,
            );
        });
    });

    describe('verifyEmail', () => {
        it('should call jwtService to verifyEmailVerification', async () => {
            await userService.verifyEmail(jwt);

            expect(jwtService.verifyEmailVerification).toHaveBeenCalledWith(
                jwt,
            );
        });

        it('should call parseSchema', async () => {
            await userService.verifyEmail(jwt);

            expect(parseSchema).toHaveBeenCalledWith(objectIdSchema, userId);
        });
    });

    describe('insertOne', () => {
        it('should call parseSchema', async () => {
            await userService.insertOne(email, passwordHash);

            expect(parseSchema).toHaveBeenCalledWith(
                userSchema,
                expect.objectContaining({
                    email,
                    passwordHash,
                }),
            );
        });

        it('should call userRepository to insertOne', async () => {
            await userService.insertOne(email, passwordHash);

            expect(userRepository.insertOne).toHaveBeenCalledWith(user);
        });

        it('should return user', async () => {
            const result = await userService.insertOne(email, passwordHash);

            expect(result).toEqual(user);
        });
    });

    describe('findOneById', () => {
        it('should call userRepository to findOne', async () => {
            await userService.findOneById(userId);

            expect(userRepository.findOne).toHaveBeenCalledWith('_id', userId);
        });

        it('should return user', async () => {
            const result = await userService.findOneById(userId);

            expect(result).toEqual(user);
        });
    });

    describe('findOneByEmail', () => {
        it('should call userRepository to findOne', async () => {
            await userService.findOneByEmail(email);

            expect(userRepository.findOne).toHaveBeenCalledWith('email', email);
        });

        it('should return user', async () => {
            const result = await userService.findOneByEmail(email);

            expect(result).toEqual(user);
        });
    });

    describe('updateOne', () => {
        it('should call parseSchema', async () => {
            await userService.updateOne(user);

            expect(parseSchema).toHaveBeenCalledWith(
                userSchema,
                expect.objectContaining({
                    _id: userId,
                    email,
                    passwordHash,
                }),
            );
        });

        it('should call userRepository to updateOne', async () => {
            await userService.updateOne(user);

            expect(userRepository.updateOne).toHaveBeenCalledWith(user);
        });

        it('should return user', async () => {
            const result = await userService.updateOne(user);

            expect(result).toEqual(user);
        });
    });
});
