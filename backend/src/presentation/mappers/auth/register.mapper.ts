import type { User } from '../../../domain/entities/user.js';
import { toUserDto } from '../common/user.mapper.js';
import type { RegisterDto } from '@shared/dto/auth/register.dto.js';

export const toRegisterDto = (user: User): RegisterDto => {
    return {
        user: toUserDto(user),
    };
};
