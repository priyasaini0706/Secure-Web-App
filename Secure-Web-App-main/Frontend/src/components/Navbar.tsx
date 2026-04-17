import { Link } from "react-router";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { totalItems } = useCart();

    return (
        <header className="mb-8 border-b">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 md:px-8">

                <Link
                    to="/"
                    className="flex items-center"
                    aria-label="logo"
                >
                    <div className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16">
                        <img
                            src="/assets/swa_logo.png"
                            alt="From Code to Secure"
                            className="h-full w-full object-contain"
                        />
                    </div>
                </Link>
                <nav className="hidden gap-12 lg:flex 2xl:ml-16">
                    <Link to={'/'} className="text-lg font-semibold text-indigo-500">Home</Link>
                    <Link to={'/product'} className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700">Collections</Link>
                    <Link to={'/'} className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700">Sale</Link>
                    <Link to={'/'} className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700">About</Link>
                </nav>

                <div className="flex divide-x border-r sm:border-l">
                    <Link to={'/login'} className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 transition duration-100 hover:bg-gray-100 active:bg-gray-200 sm:h-20 sm:w-20 md:h-24 md:w-24">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="hidden text-xs font-semibold text-gray-500 sm:block">Account</span>
                    </Link>

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