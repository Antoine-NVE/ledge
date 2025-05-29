import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

const RouterEvents = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        setUser(null);

        const handler = () => navigate('/login');
        window.addEventListener('unauthorized', handler);
        return () => window.removeEventListener('unauthorized', handler);
    }, [navigate]);

    return null;
};

export default RouterEvents;
