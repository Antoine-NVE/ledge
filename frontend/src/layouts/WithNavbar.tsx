import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const WithNavbar = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default WithNavbar;
