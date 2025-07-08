import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";

import {
  Home,
  Droplet,
  Newspaper,
  HandHeart,
  User,
  LogIn,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-amber-600 dark:text-amber-500"
          >
            <Droplet className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">Donorly</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/donation-requests"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
              <HandHeart className="h-5 w-5" />
              <span>Donation Requests</span>
            </Link>
            <Link
              to="/blog"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
              <Newspaper className="h-5 w-5" />
              <span>Blog</span>
            </Link>
            {user && (
              <Link
                to="/funding"
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                <Droplet className="h-5 w-5" />
                <span>Funding</span>
              </Link>
            )}

            {user ? (
              <div className="relative ml-4">
                <button
                  className="flex items-center space-x-1 focus:outline-none"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  )}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={logOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <div className="relative mr-4">
                <button
                  className="flex items-center space-x-1 focus:outline-none"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  )}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={logOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/donation-requests"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <HandHeart className="h-5 w-5" />
            <span>Donation Requests</span>
          </Link>
          <Link
            to="/blog"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Newspaper className="h-5 w-5" />
            <span>Blog</span>
          </Link>
          {user && (
            <Link
              to="/funding"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Droplet className="h-5 w-5" />
              <span>Funding</span>
            </Link>
          )}
          {!user && (
            <Link
              to="/login"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
