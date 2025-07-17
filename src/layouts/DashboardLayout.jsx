import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  UserCircle,
  PlusCircle,
  List,
  Users,
  FileText,
  LogOut,
  DollarSign,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  Settings,
  HelpCircle,
  Activity,
  HeartPulse,
  Droplets,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const DashboardLayout = () => {
  const { user, logOut, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return saved || (systemDark ? "dark" : "light");
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/dashboard",
      roles: ["admin", "donor", "volunteer"],
      color: "text-purple-500",
      exact: true,
    },
    {
      title: "Profile",
      icon: <UserCircle className="w-5 h-5" />,
      path: "/dashboard/profile",
      roles: ["admin", "donor", "volunteer"],
      color: "text-blue-500",
    },
    {
      title: "My Donations",
      icon: <HeartPulse className="w-5 h-5" />,
      path: "/dashboard/my-donations",
      roles: ["donor"],
      color: "text-red-500",
    },
    {
      title: "Create Request",
      icon: <PlusCircle className="w-5 h-5" />,
      path: "/dashboard/create-donation-request",
      roles: ["donor"],
      color: "text-green-500",
    },
    {
      title: "My Requests",
      icon: <List className="w-5 h-5" />,
      path: "/dashboard/my-donation-requests",
      roles: ["donor"],
      color: "text-amber-500",
    },
    {
      title: "All Users",
      icon: <Users className="w-5 h-5" />,
      path: "/dashboard/all-users",
      roles: ["admin"],
      color: "text-red-500",
    },
    {
      title: "All Requests",
      icon: <Droplets className="w-5 h-5" />,
      path: "/dashboard/all-blood-donation-request",
      roles: ["admin", "volunteer"],
      color: "text-pink-500",
    },
    {
      title: "Content Manager",
      icon: <FileText className="w-5 h-5" />,
      path: "/dashboard/content-management",
      roles: ["admin", "volunteer"],
      color: "text-indigo-500",
    },
    {
      title: "Funding",
      icon: <DollarSign className="w-5 h-5" />,
      path: "/dashboard/funding",
      roles: ["admin", "donor", "volunteer"],
      color: "text-emerald-500",
    },
    {
      title: "Analytics",
      icon: <Activity className="w-5 h-5" />,
      path: "/dashboard/analytics",
      roles: ["admin"],
      color: "text-cyan-500",
    },
    {
      title: "Health Tips",
      icon: <HeartPulse className="w-5 h-5" />,
      path: "/dashboard/health-tips",
      roles: ["admin", "donor", "volunteer"],
      color: "text-rose-500",
    },
  ];

  if (authLoading || !userRole) return <LoadingSpinner />;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr] bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-white dark:bg-gray-800 shadow-md h-screen w-full p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto sticky top-0">
        {/* Logo & Theme Toggle */}
        <div className="mb-8 flex justify-between items-center px-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Droplets className="text-red-500" />
            LifeFlow
          </h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 mb-6">
          {menuItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-l-4 border-amber-500"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className={item.color}>{item.icon}</span>
                {item.title}
              </NavLink>
            ))}
        </nav>

        {/* User + Actions */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <img
              src={user?.photoURL || "https://ui-avatars.com/api/?name=User"}
              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow"
              alt="User"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                {user?.displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {userRole}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <NavLink
              to="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="w-5 h-5" />
              Settings
            </NavLink>
            <NavLink
              to="/help-center"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <HelpCircle className="w-5 h-5" />
              Help Center
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Droplets className="w-6 h-6 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            LifeFlow
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 z-50 w-72 h-full bg-white dark:bg-gray-800 shadow-lg overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-6 h-6 text-red-500" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      LifeFlow
                    </h2>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-600 dark:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 mb-6">
                  {menuItems
                    .filter((item) => item.roles.includes(userRole))
                    .map((item) => {
                      const color = item.color
                        .replace("text-", "")
                        .split("-")[0];
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.exact} // 👈 Only exact match if specified
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? `bg-${color}-100 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-300 border-l-4 border-${color}-500`
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`
                          }
                        >
                          <span className={item.color}>{item.icon}</span>
                          {item.title}
                        </NavLink>
                      );
                    })}
                </nav>

                <div className="space-y-1">
                  <NavLink
                    to="/dashboard/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </NavLink>
                  <NavLink
                    to="/help-center"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <HelpCircle className="w-5 h-5" />
                    Help Center
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="w-full overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4  min-h-screen"
        >
          <div className="w-full overflow-x-auto">
            <Outlet />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
