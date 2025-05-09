import { Outlet } from 'react-router-dom';

const NoNavbar = () => {
    return (
        <main>
            <Outlet />
        </main>
    );
};

export default NoNavbar;
