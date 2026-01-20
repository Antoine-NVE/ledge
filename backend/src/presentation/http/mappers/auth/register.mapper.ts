import type { User } from '../../../../domain/entities/user.js';
import type { RegisterDto } from '../../dto/auth/register.dto.js';
import { toUserDto } from '../common/user.mapper.js';

export const toRegisterDto = (user: User): RegisterDto => {
    return {
        user: toUserDto(user),
    };
};
