import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

const RouterEvents = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const handler = () => {
            setUser(null);
            navigate('/login');
        };

        window.addEventListener('unauthorized', handler);
        return () => window.removeEventListener('unauthorized', handler);
    }, [navigate, setUser]);

    return null;
};

export default RouterEvents;
