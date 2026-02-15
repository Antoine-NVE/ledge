import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { me } from '../api/users';
import type { UserDto } from '@shared/dto/user.dto.ts';

type AuthContextType = {
    user: UserDto | null;
    isLoading: boolean;
    setUser: (user: UserDto | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
