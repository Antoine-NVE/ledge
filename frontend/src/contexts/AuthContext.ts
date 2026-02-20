import type { UserDto } from '@shared/dto/user.dto.ts';
import { createContext } from 'react';

type AuthContextType = {
    user: UserDto | null;
    isLoading: boolean;
    setUser: (user: UserDto | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
