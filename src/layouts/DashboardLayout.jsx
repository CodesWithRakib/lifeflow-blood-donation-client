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
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const DashboardLayout = () => {
  const { user, logOut, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    },
    {
      title: "Profile",
      icon: <UserCircle className="w-5 h-5" />,
      path: "/dashboard/profile",
      roles: ["admin", "donor", "volunteer"],
    },
    {
      title: "Create Request",
      icon: <PlusCircle className="w-5 h-5" />,
      path: "/dashboard/create-donation-request",
      roles: ["donor"],
    },
    {
      title: "My Requests",
      icon: <List className="w-5 h-5" />,
      path: "/dashboard/my-donation-requests",
      roles: ["donor"],
    },
    {
      title: "All Users",
      icon: <Users className="w-5 h-5" />,
      path: "/dashboard/all-users",
      roles: ["admin"],
    },
    {
      title: "All Requests",
      icon: <List className="w-5 h-5" />,
      path: "/dashboard/all-blood-donation-request",
      roles: ["admin", "volunteer"],
    },
    {
      title: "Content Manager",
      icon: <FileText className="w-5 h-5" />,
      path: "/dashboard/content-management",
      roles: ["admin", "volunteer"],
    },
    {
      title: "Funding",
      icon: <DollarSign className="w-5 h-5" />,
      path: "/dashboard/funding",
      roles: ["admin", "donor", "volunteer"],
    },
  ];

  if (authLoading || !userRole) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="bg-white shadow-md min-h-screen w-64 p-4 fixed top-0 left-0 hidden md:flex flex-col border-r border-gray-200 z-20">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">
            Dashboard
          </h2>

          <nav className="flex flex-col gap-1">
            {menuItems
              .filter((item) => item.roles.includes(userRole))
              .map((item) => (
                <NavLink
                  to={item.path}
                  key={item.path}
                  end={item.path === "/dashboard"} // ✅ fixes active issue
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                      isActive
                        ? "bg-amber-500/10 text-amber-700 border-l-4 border-amber-500"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="text-gray-500">{item.icon}</span>
                  {item.title}
                </NavLink>
              ))}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <img
              src={user?.photoURL || "https://ui-avatars.com/api/?name=User"}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-white shadow"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </header>

      {/* Mobile Sidebar with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-6 p-2">
                  <img
                    src={
                      user?.photoURL || "https://ui-avatars.com/api/?name=User"
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full border-2 border-white shadow"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userRole}
                    </p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1 mb-4">
                  {menuItems
                    .filter((item) => item.roles.includes(userRole))
                    .map((item) => (
                      <NavLink
                        to={item.path}
                        key={item.path}
                        end={item.path === "/dashboard"} // ✅ apply fix here too
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                            isActive
                              ? "bg-amber-500/10 text-amber-700 border-l-4 border-amber-500"
                              : "text-gray-600 hover:bg-gray-100"
                          }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="text-gray-500">{item.icon}</span>
                        {item.title}
                      </NavLink>
                    ))}
                </nav>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-4 md:p-6 min-h-[calc(100vh-32px)]"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
