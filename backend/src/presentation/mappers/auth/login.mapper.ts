import type { User } from '../../../domain/entities/user.js';
import { toUserDto } from '../common/user.mapper.js';
import type { LoginDto } from '@shared/dto/auth/login.dto.js';

export const toLoginDto = (user: User): LoginDto => ({
    user: toUserDto(user),
});
