import type { User } from '../../../domain/entities/user.js';
import type { UserDto } from '@shared/dto/common/user.dto.js';

export const toUserDto = (user: User): UserDto => {
    return {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
};
