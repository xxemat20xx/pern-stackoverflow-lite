import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
                StackOverflow Lite
            </Link>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <span className="flex items-center gap-2 text-gray-700">
                            <User size={18} />
                            {user.username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-800"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;