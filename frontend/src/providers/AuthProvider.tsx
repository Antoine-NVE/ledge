import { useEffect, useState, type ReactNode } from 'react';
import { me } from '../api/users';
import type { UserDto } from '@shared/dto/user.dto.ts';
import { AuthContext } from '../contexts/AuthContext.ts';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const response = await me();
            if (response.success) setUser(response.data);
            setIsLoading(false);
        };

        initAuth();
    }, []);

    return <AuthContext.Provider value={{ user, isLoading, setUser }}>{children}</AuthContext.Provider>;
};
