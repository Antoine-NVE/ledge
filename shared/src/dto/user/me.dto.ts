import type { UserDto } from '../common/user.dto.js';

export type MeDto = Readonly<{
    user: UserDto;
}>;
