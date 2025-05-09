import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
            {/* Partie gauche : logo + liens */}
            <div className="flex items-center gap-6">
                {/* Logo */}
                <NavLink to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
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
                    }>
                    Home
                </NavLink>

                {/* Tu peux ajouter d'autres liens ici si besoin */}
            </div>

            {/* Partie droite : future zone pour login/profil */}
            <div className="flex items-center gap-4">{/* Placeholder pour plus tard */}</div>
        </nav>
    );
};

export default Navbar;
