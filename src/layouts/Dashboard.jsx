import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Home,
  ListCheck,
  FilePlus,
  Menu,
  X,
  UserCheck,
  Shield,
  Activity,
  Settings,
  LogOut,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const axiosSecure = useAxios();
  const { logOut } = useAuth();

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/user");
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Common links for all users
  const commonLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/dashboard/profile", label: "Profile", icon: <User size={18} /> },
    {
      to: "/dashboard/my-donation-requests",
      label: "My Requests",
      icon: <ListCheck size={18} />,
    },
    {
      to: "/dashboard/create-donation-request",
      label: "Create Request",
      icon: <FilePlus size={18} />,
    },
  ];

  // Admin specific links
  const adminLinks = [
    {
      to: "/dashboard/all-users",
      label: "Manage Users",
      icon: <UserCheck size={18} />,
    },
    {
      to: "/dashboard/all-blood-donation-request",
      label: "All Requests",
      icon: <Activity size={18} />,
    },
    {
      to: "/dashboard/content-management",
      label: "Content",
      icon: <Settings size={18} />,
    },
  ];

  // Volunteer specific links
  const volunteerLinks = [
    {
      to: "/dashboard/all-blood-donation-request",
      label: "All Requests",
      icon: <Activity size={18} />,
    },
  ];

  // Combine links based on user role
  const getLinks = () => {
    let links = [...commonLinks];

    if (user?.role === "admin") {
      links = [...links, ...adminLinks];
    } else if (user?.role === "volunteer") {
      links = [...links, ...volunteerLinks];
    }

    return links;
  };
  const handleLogout = () => {
    logOut();
    refetch();
  };

  const links = getLinks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {refetch()}
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          className={`fixed z-30 m-4 p-2 rounded-md ${
            sidebarOpen ? "hidden" : "block"
          } bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300`}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <>
            {/* Overlay for mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-20"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar content */}
            <motion.aside
              initial={{ x: isMobile ? -300 : 0 }}
              animate={{ x: 0 }}
              exit={{ x: isMobile ? -300 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed md:relative z-30 w-64 h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col ${
                isMobile ? "" : "translate-x-0"
              }`}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  {user?.role === "admin" && (
                    <Shield className="text-amber-500" size={20} />
                  )}
                  <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    Donorly
                  </h2>
                </div>
                {isMobile && (
                  <button
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                  >
                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>

              {/* User profile mini card */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.avatar || "/default-avatar.png"}
                    alt={user?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-600"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user?.role || "user"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {links.map(({ to, label, icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-amber-50 text-amber-600 dark:bg-gray-700 dark:text-amber-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    <span className="text-current">{icon}</span>
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Bottom section */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar for mobile */}
        {isMobile && (
          <header className="md:hidden bg-white dark:bg-gray-800 px-4 py-3 shadow-sm flex items-center justify-between z-10">
            <h1 className="text-lg font-semibold text-amber-600 dark:text-amber-400">
              Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt={user?.name || "User"}
                className="w-8 h-8 rounded-full object-cover bg-gray-200 dark:bg-gray-600"
              />
            </div>
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
