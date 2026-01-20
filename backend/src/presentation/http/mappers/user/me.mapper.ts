import type { User } from '../../../../domain/entities/user.js';
import type { MeDto } from '../../dto/user/me.dto.js';
import { toUserDto } from '../common/user.mapper.js';

export const toMeDto = (user: User): MeDto => {
    return {
        user: toUserDto(user),
    };
};
