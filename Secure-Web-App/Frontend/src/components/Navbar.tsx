import { Link } from "react-router-dom"; // Fixed import
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();

    return (
        <header className="mb-8 border-b bg-white sticky top-0 z-50">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 md:px-8 h-20">

                <Link
                    to="/"
                    className="flex items-center"
                    aria-label="logo"
                >
                    <div className="h-10 w-10 md:h-12 md:w-12">
                        <img
                            src="/assets/swa_logo.png"
                            alt="SWA Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                </Link>
                <nav className="hidden gap-8 lg:flex items-center">
                    <Link to={'/'} className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition">Home</Link>
                    <Link to={'/product'} className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition">Collections</Link>
                    {user?.role === "admin" && (
                        <Link to={'/admin'} className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition">Admin Panel</Link>
                    )}
                    <Link to={'/'} className="text-sm font-bold text-gray-600 hover:text-indigo-500 transition">Sale</Link>
                </nav>



                <div className="flex divide-x border-r sm:border-l relative group">
                    {/* Account Dropdown */}
                    <div className="relative">
                        <button className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 transition duration-100 hover:bg-gray-100 active:bg-gray-200 sm:h-20 sm:w-20 md:h-24 md:w-24 peer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="hidden text-xs font-semibold text-gray-500 sm:block">Account</span>
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full w-48 bg-white border border-gray-100 shadow-xl rounded-b-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                            {user ? (
                                <>
                                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
                                        <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                                    </div>
                                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">My Dashboard</Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium">Admin Dashboard</Link>
                                    )}
                                    <button 
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">Login / Sign Up</Link>
                            )}
                        </div>
                    </div>

                    <Link to="/cart" className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 transition duration-100 hover:bg-gray-100 active:bg-gray-200 sm:h-20 sm:w-20 md:h-24 md:w-24 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {totalItems > 0 && (
                            <span className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                        <span className="hidden text-xs font-semibold text-gray-500 sm:block">Cart</span>
                    </Link>
                </div>


                <button type="button" className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 transition duration-100 hover:bg-gray-100 active:bg-gray-200 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>

                    <span className="hidden text-xs font-semibold text-gray-500 sm:block">Menu</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;