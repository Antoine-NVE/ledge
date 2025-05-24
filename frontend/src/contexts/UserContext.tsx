import { createContext, ReactNode, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User } from '../types/user';

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
                credentials: 'include',
            });
            const { data } = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error during user fetch');
            }

            setUser(data.user || null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const value = useMemo(() => ({ user, loading, error, refreshUser: fetchUser }), [user, loading, error, fetchUser]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
