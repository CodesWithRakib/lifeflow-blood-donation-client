import { useState } from "react";
import { Outlet, NavLink } from "react-router";
import { User, Home, ListCheck, FilePlus, Menu, X } from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Home", icon: <Home size={18} /> },
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
    // Add admin/volunteer links later
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 transform w-64 bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-amber-600">Donorly</h2>
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="px-4 py-6 space-y-2">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-md transition-all ${
                  isActive
                    ? "bg-amber-100 text-amber-600 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-amber-100 hover:text-amber-600"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* TopBar on small screen */}
        <header className="md:hidden bg-white dark:bg-gray-800 px-4 py-3 shadow-sm flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 dark:text-gray-300 hover:text-amber-600"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-amber-600">Dashboard</h1>
          <div /> {/* Placeholder to center the title */}
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
