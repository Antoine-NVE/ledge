import { UserData } from '../../domain/user/user-types';

export type RegisterInput = Pick<UserData, 'email'> & { password: string };

export type LoginInput = Pick<UserData, 'email'> & { password: string };
