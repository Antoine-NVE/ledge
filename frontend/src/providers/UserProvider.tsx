import { useState } from 'react';
import UserContext from '../contexts/UserContext';
import { getCurrentUser } from '../api/user';
import { User } from '../types/user';

const UserProvider = ({ children }: { children: React.ReactNode }) => {
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

    return <UserContext.Provider value={{ user, loading, error, syncUser, setUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
