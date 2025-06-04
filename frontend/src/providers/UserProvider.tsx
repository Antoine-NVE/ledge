import { useEffect, useRef, useState } from 'react';
import UserContext from '../contexts/UserContext';
import { getCurrentUser } from '../api/user';
import { User } from '../types/user';

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const hasMounted = useRef(false);

    const syncUser = async () => {
        setIsLoading(true);
        setError(null);

        const [result, response] = await getCurrentUser();

        if (!response || !response.ok) {
            setError(result.message);
            setUser(null);
            setIsLoading(false);
            return;
        }

        setUser(result.data!.user);
        setIsLoading(false);
    };

    useEffect(() => {
        if (hasMounted.current) return;
        hasMounted.current = true;

        syncUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, isLoading, error, syncUser, setUser }}>{children}</UserContext.Provider>
    );
};

export default UserProvider;
