import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '../types/user';
import { getCurrentUser } from '../api/user';

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    syncUser: () => Promise<void>;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const syncUser = async () => {
        setLoading(true);
        setError(null);

        const [result, response] = await getCurrentUser();

        if (!response || !response.ok) {
            setError(result.message);
            setUser(null);
            setLoading(false);
            return;
        }

        setUser(result.data!.user);
        setLoading(false);
    };

    useEffect(() => {
        syncUser();
    }, []);

    return <UserContext.Provider value={{ user, loading, error, syncUser, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
