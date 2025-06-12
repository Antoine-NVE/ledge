import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RouterEvents from '../components/RouterEvents';

const WithNavbar = () => {
    return (
        <>
            <RouterEvents />
            <Navbar />
            <Outlet />
        </>
    );
};

export default WithNavbar;
