import type { User } from '../../../../domain/entities/user.js';
import type { LoginDto } from '../../dto/auth/login.dto.js';
import { toUserDto } from '../common/user.mapper.js';

export const toLoginDto = (user: User): LoginDto => {
    return {
        user: toUserDto(user),
    };
};
