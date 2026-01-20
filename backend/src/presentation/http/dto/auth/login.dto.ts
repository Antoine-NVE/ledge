import type { UserDto } from '../common/user.dto.js';

export type LoginDto = Readonly<{
    user: UserDto;
}>;
