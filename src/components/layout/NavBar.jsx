import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router";
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
  Moon,
  Sun,
  Droplets,
  AlertTriangle,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import useAuth from "../../hooks/useAuth";

// Memoized ThemeToggle Component
const ThemeToggle = React.memo(({ theme, toggleTheme }) => (
  <motion.button
    onClick={toggleTheme}
    className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    whileTap={{ scale: 0.9 }}
    aria-label={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
  >
    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
  </motion.button>
));

// Memoized UserMenu Component
const UserMenu = React.memo(
  ({ user, isOpen, onClose, onLogout, onDashboardClick, hasNotifications }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={{
            open: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.2, ease: "easeOut" },
            },
            closed: {
              opacity: 0,
              y: -10,
              transition: { duration: 0.15, ease: "easeIn" },
            },
          }}
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-800 dark:text-white truncate">
              {user.displayName || "User"}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
              {user.email}
            </p>
          </div>

          {/* Donation Progress */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Donation Goal
              </span>
              <span className="font-medium">65%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-red-500 h-1.5 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>

          <a
            href="/dashboard"
            onClick={onDashboardClick}
            className="block px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-gray-700 text-sm flex gap-2 items-center transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-500" />
            Dashboard
          </a>

          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-gray-700 text-sm flex gap-2 items-center transition-colors"
          >
            <LogOut className="w-4 h-4 text-amber-500" />
            Sign out
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
);

// Memoized Desktop NavLink Component
const DesktopNavLink = React.memo(({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
        isActive
          ? "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-gray-800"
          : "text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      }`
    }
  >
    {icon}
    <span>{children}</span>
    {({ isActive }) =>
      isActive && (
        <motion.span
          layoutId="desktop-nav-indicator"
          className="absolute inset-x-3 -bottom-px h-0.5 bg-amber-500 rounded-full"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )
    }
  </NavLink>
));

// Memoized Mobile NavLink Component
const MobileNavLink = React.memo(({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
        isActive
          ? "bg-amber-50 dark:bg-gray-800 text-amber-600 dark:text-amber-400"
          : "text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-800"
      }`
    }
  >
    {React.cloneElement(icon, {
      className: `w-5 h-5 ${({ isActive }) =>
        isActive ? "text-amber-500" : "text-gray-500 dark:text-gray-400"}`,
    })}
    {children}
  </NavLink>
));

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return savedTheme || (systemPrefersDark ? "dark" : "light");
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false); // Mock state

  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const userMenuButtonRef = useRef(null);

  // Animation variants
  const mobileMenuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // Optimized event handlers
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      setIsUserMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logOut, navigate]);

  const handleDashboardClick = useCallback(
    (e) => {
      e.preventDefault();
      setIsUserMenuOpen(false);
      navigate("/dashboard");
    },
    [navigate]
  );

  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const closeUserMenu = useCallback(() => {
    setIsUserMenuOpen(false);
    userMenuButtonRef.current?.focus();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        closeUserMenu();
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeUserMenu, closeMobileMenu]);

  // Handle scroll effect with passive listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    closeMobileMenu();
    closeUserMenu();
  }, [location, closeMobileMenu, closeUserMenu]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMobileMenu();
        closeUserMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMobileMenu, closeUserMenu]);

  // Mock notification check (replace with actual implementation)
  useEffect(() => {
    // Simulate checking for notifications
    const checkNotifications = () => {
      // In a real app, this would be an API call
      setHasNotifications(Math.random() > 0.7); // Randomly show notifications
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm"
          : "bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with blood drop animation */}
          <Link
            to="/"
            className="flex items-center gap-2 text-amber-600 hover:opacity-90 transition-opacity"
            aria-label="LifeFlow Home"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Droplets className="h-7 w-7 text-red-500" />
            </motion.div>
            <motion.span
              className="text-xl font-bold tracking-tight"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              LifeFlow
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <DesktopNavLink to="/" icon={<Home size={18} />}>
              Home
            </DesktopNavLink>
            <DesktopNavLink
              to="/donation-requests"
              icon={<HandHeart size={18} />}
            >
              Donation Requests
            </DesktopNavLink>
            <DesktopNavLink to="/blog" icon={<Newspaper size={18} />}>
              Blog
            </DesktopNavLink>
            {user && (
              <>
                <DesktopNavLink to="/funding" icon={<Droplet size={18} />}>
                  Funding
                </DesktopNavLink>

                {/* Emergency Button */}
                <Link
                  to="/emergency-request"
                  className="ml-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium shadow hover:shadow-md transition-all active:scale-95"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Emergency
                </Link>

                {/* Notifications */}
                <div className="relative ml-1">
                  <button className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Bell className="h-5 w-5" />
                  </button>
                  {hasNotifications && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            {/* User Menu */}
            {user ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <motion.button
                  ref={userMenuButtonRef}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="rounded-full focus:outline-none"
                  whileTap={{ scale: 0.95 }}
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  {user.photoURL ? (
                    <motion.div className="relative">
                      {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                      )}
                      <motion.img
                        src={user.photoURL}
                        alt="User profile"
                        className="h-8 w-8 rounded-full object-cover border border-amber-500"
                        whileHover={{ scale: 1.05 }}
                        onLoad={() => setImageLoaded(true)}
                        style={{ opacity: imageLoaded ? 1 : 0 }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="h-8 w-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center border border-amber-500"
                      whileHover={{ scale: 1.05 }}
                    >
                      <User className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                    </motion.div>
                  )}
                </motion.button>
                <UserMenu
                  user={user}
                  isOpen={isUserMenuOpen}
                  onClose={closeUserMenu}
                  onLogout={handleLogout}
                  onDashboardClick={handleDashboardClick}
                  hasNotifications={hasNotifications}
                />
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium shadow hover:shadow-md transition-all active:scale-95"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <motion.button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              <MobileNavLink to="/" icon={<Home size={18} />}>
                Home
              </MobileNavLink>
              <MobileNavLink
                to="/donation-requests"
                icon={<HandHeart size={18} />}
              >
                Donation Requests
              </MobileNavLink>
              <MobileNavLink to="/blog" icon={<Newspaper size={18} />}>
                Blog
              </MobileNavLink>
              {user && (
                <>
                  <MobileNavLink to="/funding" icon={<Droplet size={18} />}>
                    Funding
                  </MobileNavLink>
                  <MobileNavLink
                    to="/dashboard"
                    icon={<LayoutDashboard size={18} />}
                  >
                    Dashboard
                  </MobileNavLink>
                  <Link
                    to="/emergency-request"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    Emergency Request
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-amber-500" />
                    Sign out
                  </button>
                </>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="block px-4 py-2.5 text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-md text-center font-medium shadow hover:shadow-md transition-all"
                >
                  <LogIn className="w-5 h-5 inline mr-2" />
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
