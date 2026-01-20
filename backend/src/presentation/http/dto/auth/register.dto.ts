import type { UserDto } from '../common/user.dto.js';

export type RegisterDto = Readonly<{
    user: UserDto;
}>;
