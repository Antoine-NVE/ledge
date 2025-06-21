import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RouterEvents from '../components/RouterEvents';

const Private = () => {
    return (
        <>
            <RouterEvents />
            <Navbar />
            <Outlet />
        </>
    );
};

export default Private;
