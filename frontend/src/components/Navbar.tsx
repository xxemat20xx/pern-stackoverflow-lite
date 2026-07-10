import { Link } from "react-router-dom";
import {
    LogOut,
    Search,
    MessageSquare,
} from "lucide-react";

import useAuthStore from "../store/authStore";

const Navbar = () => {
    const { user, logout } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200">

            <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                    <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center">

                        <MessageSquare size={18} />

                    </div>

                    <div>

                        <h1 className="font-bold text-lg tracking-tight text-zinc-900">
                            StackOverflow Lite
                        </h1>

                        <p className="text-xs text-zinc-500">
                            Community Q&A
                        </p>

                    </div>

                </Link>

                {/* Search */}

                <div className="hidden lg:block flex-1 max-w-md mx-10">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-3.5 text-zinc-400"
                        />

                        <input
                            type="text"
                            placeholder="Search questions..."
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition"
                        />

                    </div>

                </div>

                {/* Right */}

                {user ? (

                    <div className="flex items-center gap-4">

                        {/* User */}

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">

                                {user.username.charAt(0).toUpperCase()}

                            </div>

                            <div className="hidden md:block">

                                <p className="font-medium text-zinc-900">

                                    {user.username}

                                </p>

                                <p className="text-xs text-zinc-500">

                                    Community Member

                                </p>

                            </div>

                        </div>

                        {/* Logout */}

                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-zinc-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition"
                        >

                            <LogOut size={17} />

                            <span className="hidden sm:block">

                                Logout

                            </span>

                        </button>

                    </div>

                ) : (

                    <Link
                        to="/login"
                        className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-black text-white font-medium transition"
                    >

                        Login

                    </Link>

                )}

            </div>

        </header>
    );
};

export default Navbar;