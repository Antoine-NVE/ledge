import { createContext } from 'react';
import { User } from '../types/user';

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    syncUser: () => Promise<void>;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;
