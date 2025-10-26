import { ObjectId } from 'mongodb';
import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import { RefreshTokenService } from '../../services/refresh-token-service';
import { refreshTokenSchema } from '../../infrastructure/schemas/refresh-token-schemas';
import { parseSchema } from '../../utils/schema-utils';
import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';

const userId = new ObjectId();
const token = 'token';
const refreshToken = {} as unknown as RefreshToken;

jest.mock('../../utils/schema-utils', () => ({
    parseSchema: jest.fn(),
}));

const refreshTokenRepository = {
    insertOne: jest.fn(),
    findOne: jest.fn().mockReturnValue(refreshToken),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
} as unknown as RefreshTokenRepository;

const tokenService = {
    generate: jest.fn().mockReturnValue(token),
};

describe('RefreshTokenService', () => {
    let refreshTokenService: RefreshTokenService;

    beforeEach(() => {
        jest.clearAllMocks();

        // I can't mock return value at initialization, don't know why
        (parseSchema as jest.Mock).mockReturnValue(refreshToken);

        refreshTokenService = new RefreshTokenService(
            refreshTokenRepository,
            tokenService,
        );
    });

    describe('insertOne', () => {
        it('should call parseSchema', async () => {
            await refreshTokenService.insertOne(userId);

            expect(parseSchema).toHaveBeenCalledWith(
                refreshTokenSchema,
                expect.objectContaining({
                    token,
                    userId,
                }),
            );
        });

        it('should call refreshTokenRepository to insertOne', async () => {
            await refreshTokenService.insertOne(userId);

            expect(refreshTokenRepository.insertOne).toHaveBeenLastCalledWith(
                refreshToken,
            );
        });

        it('should return refreshToken', async () => {
            const result = await refreshTokenService.insertOne(userId);

            expect(result).toEqual(refreshToken);
        });
    });

    describe('findOneByToken', () => {
        it('should call refreshTokenRepository to findOne', async () => {
            await refreshTokenService.findOneByToken(token);

            expect(refreshTokenRepository.findOne).toHaveBeenCalledWith(
                'token',
                token,
            );
        });

        it('should return refreshToken', async () => {
            const result = await refreshTokenService.findOneByToken(token);

            expect(result).toEqual(refreshToken);
        });
    });

    describe('updateOne', () => {
        it('should call parseSchema', async () => {
            await refreshTokenService.updateOne(refreshToken);

            expect(parseSchema).toHaveBeenCalledWith(
                refreshTokenSchema,
                refreshToken,
            );
        });

        it('should call refreshTokenRepository to updateOne', async () => {
            await refreshTokenService.updateOne(refreshToken);

            expect(refreshTokenRepository.updateOne).toHaveBeenCalledWith(
                refreshToken,
            );
        });

        it('should return refreshToken', async () => {
            const result = await refreshTokenService.updateOne(refreshToken);

            expect(result).toEqual(refreshToken);
        });
    });

    describe('deleteOneByToken', () => {
        it('should call refreshTokenRepository to deleteOne', async () => {
            await refreshTokenService.deleteOneByToken(token);

            expect(refreshTokenRepository.deleteOne).toHaveBeenCalledWith(
                'token',
                token,
            );
        });
    });
});
