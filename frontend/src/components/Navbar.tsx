import { Link } from "react-router-dom";
import {
    LogOut,
    User,
    Search,
    MessageSquare,
} from "lucide-react";

import useAuthStore from "../store/authStore";

const Navbar = () => {
    const { user, logout } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                        <MessageSquare size={20} />
                    </div>

                    <div>
                        <h1 className="font-bold text-lg text-gray-900">
                            StackOverflow Lite
                        </h1>

                        <p className="text-xs text-gray-500 -mt-1">
                            Community Q&A
                        </p>
                    </div>
                </Link>

                {/* Search */}

                <div className="hidden lg:flex relative w-[380px]">

                    <Search
                        size={18}
                        className="absolute left-4 top-3.5 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search questions..."
                        className="w-full bg-gray-100 border border-transparent rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition"
                    />

                </div>

                {/* Right */}

                {user ? (
                    <div className="flex items-center gap-4">

                        {/* User */}

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            <div className="hidden md:block">

                                <p className="font-medium text-gray-900">
                                    {user.username}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Community Member
                                </p>

                            </div>

                        </div>

                        {/* Logout */}

                        <button
                            onClick={logout}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition"
                        >
                            <LogOut size={18} />

                            <span className="hidden sm:block">
                                Logout
                            </span>
                        </button>

                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
                    >
                        Login
                    </Link>
                )}

            </div>
        </header>
    );
};

export default Navbar;