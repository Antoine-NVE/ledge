import type { User } from '../../../domain/entities/user.js';
import { toUserDto } from '../common/user.mapper.js';
import type { MeDto } from '@shared/dto/user/me.dto.js';

export const toMeDto = (user: User): MeDto => ({
    user: toUserDto(user),
});
