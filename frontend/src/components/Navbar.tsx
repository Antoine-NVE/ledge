import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import { useState } from 'react';
import useUser from '../hooks/useUser';

const Navbar = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsLoading(true);
        const [result, response] = await logout();
        if (!response || !response.ok) {
            console.error(result.message);

            setIsLoading(false);
            return;
        }

        setUser(null);
        navigate('/login');
        setIsLoading(false);
    };

    return (
        <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
            {/* Partie gauche : logo + liens */}
            <div className="flex items-center gap-6">
                {/* Logo */}
                <NavLink
                    to="/"
                    className="text-xl font-bold text-gray-800 hover:text-blue-600 transition"
                >
                    Ledge
                </NavLink>

                {/* Liens de navigation */}
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `text-sm ${
                            isActive
                                ? 'text-blue-600 underline underline-offset-4'
                                : 'text-gray-600 hover:text-blue-600'
                        } transition`
                    }
                >
                    Home
                </NavLink>

                {/* Tu peux ajouter d'autres liens ici si besoin */}
            </div>

            <div className="flex items-center gap-4">
                {/* Profile */}
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `text-sm ${
                            isActive
                                ? 'text-blue-600 underline underline-offset-4'
                                : 'text-gray-600 hover:text-blue-600'
                        } transition`
                    }
                >
                    Profile
                </NavLink>
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer transition disabled:opacity-50"
                    onClick={handleLogout}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging out...' : 'Logout'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
