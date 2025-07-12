import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
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
import { motion, AnimatePresence } from "motion/react";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Animation variants
  const mobileMenuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const userMenuVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15,
      },
    },
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logOut();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    setIsUserMenuOpen(false);
    navigate("/dashboard");
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
            className="flex items-center space-x-2 text-amber-600 dark:text-amber-500 hover:opacity-90 transition-opacity"
          >
            <Droplet className="h-8 w-8" />
            <motion.span
              className="text-2xl font-bold tracking-tight"
              whileHover={{ scale: 1.05 }}
            >
              Donorly
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/donation-requests"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
              <motion.span
                className="flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <HandHeart className="h-4 w-4" />
                Donation Requests
              </motion.span>
            </Link>
            <Link
              to="/blog"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
              <motion.span
                className="flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <Newspaper className="h-4 w-4" />
                Blog
              </motion.span>
            </Link>
            {user && (
              <Link
                to="/funding"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                <motion.span
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Droplet className="h-4 w-4" />
                  Funding
                </motion.span>
              </Link>
            )}

            {user ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <motion.button
                  onClick={toggleUserMenu}
                  className="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  whileTap={{ scale: 0.95 }}
                >
                  {user.photoURL ? (
                    <motion.img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                      whileHover={{ scale: 1.1 }}
                    />
                  ) : (
                    <motion.div
                      className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center border border-gray-200 dark:border-gray-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </motion.div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={userMenuVariants}
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <a
                        href="/dashboard"
                        onClick={handleDashboardClick}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors flex items-center gap-1"
              >
                <motion.span
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </motion.span>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={toggleUserMenu}
                  className="flex items-center justify-center rounded-full focus:outline-none"
                  whileTap={{ scale: 0.95 }}
                >
                  {user.photoURL ? (
                    <motion.img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                      whileHover={{ scale: 1.1 }}
                    />
                  ) : (
                    <motion.div
                      className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center border border-gray-200 dark:border-gray-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </motion.div>
                  )}
                </motion.button>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogIn className="h-5 w-5" />
                </motion.div>
              </Link>
            )}

            <motion.button
              onClick={toggleMenu}
              className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 focus:outline-none"
              aria-expanded={isMenuOpen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        ref={mobileMenuRef}
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
        className="md:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
          <Link
            to="/donation-requests"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <HandHeart className="h-5 w-5" />
            Donation Requests
          </Link>
          <Link
            to="/blog"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <Newspaper className="h-5 w-5" />
            Blog
          </Link>
          {user && (
            <>
              <Link
                to="/funding"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <Droplet className="h-5 w-5" />
                Funding
              </Link>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
            </>
          )}
          {!user && (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-amber-600 hover:bg-amber-700 flex items-center gap-2 justify-center"
            >
              <LogIn className="h-5 w-5" />
              Login
            </Link>
          )}
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
