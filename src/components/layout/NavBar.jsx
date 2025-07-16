// src/components/shared/Navbar.jsx
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
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const mobileMenuVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  const userMenuVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    closed: { opacity: 0, y: -10, transition: { duration: 0.15 } },
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

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
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-[#F59E0B] hover:opacity-90 transition-opacity"
          >
            <Droplet className="h-8 w-8" />
            <motion.span
              className="text-2xl font-bold tracking-tight"
              whileHover={{ scale: 1.05 }}
            >
              Donorly
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6 text-[15px]">
            <NavLink to="/donation-requests" icon={<HandHeart />}>
              Donation Requests
            </NavLink>
            <NavLink to="/blog" icon={<Newspaper />}>
              Blog
            </NavLink>
            {user && (
              <NavLink to="/funding" icon={<Droplet />}>
                Funding
              </NavLink>
            )}

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="rounded-full focus:outline-none"
                  whileTap={{ scale: 0.95 }}
                >
                  {user.photoURL ? (
                    <motion.img
                      src={user.photoURL}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover border"
                      whileHover={{ scale: 1.1 }}
                    />
                  ) : (
                    <motion.div
                      className="h-8 w-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center border"
                      whileHover={{ scale: 1.1 }}
                    >
                      <User className="h-4 w-4 text-[#DC2626]" />
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
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-md rounded-md z-50"
                    >
                      <div className="px-4 py-2 border-b text-sm">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                      <a
                        href="/dashboard"
                        onClick={handleDashboardClick}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex gap-2 items-center"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex gap-2 items-center"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-3 bg-[#F59E0B] hover:bg-[#D97706] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button p-2 rounded-md text-gray-700 dark:text-gray-300"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        ref={mobileMenuRef}
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
        className="md:hidden bg-white dark:bg-gray-900 border-t"
      >
        <div className="px-2 pt-2 pb-4 space-y-1">
          <MobileLink to="/" icon={<Home />}>
            Home
          </MobileLink>
          <MobileLink to="/donation-requests" icon={<HandHeart />}>
            Donation Requests
          </MobileLink>
          <MobileLink to="/blog" icon={<Newspaper />}>
            Blog
          </MobileLink>
          {user && (
            <>
              <MobileLink to="/funding" icon={<Droplet />}>
                Funding
              </MobileLink>
              <MobileLink to="/dashboard" icon={<LayoutDashboard />}>
                Dashboard
              </MobileLink>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#F59E0B]"
              >
                <LogOut className="w-5 h-5" />
                Sign out
              </button>
            </>
          )}
          {!user && (
            <Link
              to="/login"
              className="block px-3 py-2 text-white bg-[#F59E0B] hover:bg-[#D97706] rounded-md text-center"
            >
              <LogIn className="w-5 h-5 inline mr-1" />
              Login
            </Link>
          )}
        </div>
      </motion.div>
    </header>
  );
};

// Desktop NavLink Helper
const NavLink = ({ to, icon, children }) => (
  <Link
    to={to}
    className="text-gray-700 dark:text-gray-300 hover:text-[#DC2626] transition flex items-center gap-1"
  >
    <motion.span
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-1"
    >
      {icon}
      {children}
    </motion.span>
  </Link>
);

// Mobile Link Helper
const MobileLink = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#DC2626] rounded-md"
  >
    {icon}
    {children}
  </Link>
);

export default Navbar;
