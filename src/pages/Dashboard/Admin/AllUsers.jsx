import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { format } from "date-fns";
import {
  MoreVertical,
  Lock,
  Unlock,
  Mail,
  UserRound,
  CheckCircle,
  Ban,
  Crown,
  HandHeart,
  Shield,
  Users,
  Filter,
  Search,
} from "lucide-react";
import useAxios from "../../../hooks/useAxios";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Pagination from "../../../components/common/Pagination";
import useTitle from "../../../hooks/useTitle";

const AllUsers = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const limit = 10;
  const menuRef = useRef(null);

  useTitle("All Users | LifeFlow - Blood Donation");

  // Fetch users with proper error handling
  const {
    data: usersData = {
      users: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["all-users", statusFilter, roleFilter, searchQuery, page],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(
          `/users?status=${statusFilter === "all" ? "" : statusFilter}` +
            `&role=${roleFilter === "all" ? "" : roleFilter}` +
            `&search=${searchQuery}` +
            `&page=${page}&limit=${limit}`
        );
        return data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch users"
        );
      }
    },
    keepPreviousData: true,
    retry: 2,
  });

  // Define columns for TanStack Table
  const columns = [
    {
      accessorKey: "name",
      header: "User Profile",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow"
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=random`
                }
                alt={user.name}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=random`;
                }}
              />
              {user.role === "admin" && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5 shadow-sm">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Joined: {format(new Date(user.createdAt), "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {user.email}
              </span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-blue-500 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-500 dark:text-gray-400">
                  {user.phone}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            {user.role === "admin" ? (
              <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            ) : user.role === "volunteer" ? (
              <HandHeart className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <UserRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                user.role === "admin"
                  ? "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                  : user.role === "volunteer"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                  : "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
              }`}
            >
              {user.role}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            {user.status === "active" ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                user.status === "active"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                  : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200"
              }`}
            >
              {user.status}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="relative flex justify-end" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === user._id ? null : user._id);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {activeMenu === user._id && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                <div className="py-1">
                  {user.status === "active" ? (
                    <button
                      onClick={() => handleUserAction(user._id, "block")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 w-full text-left transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Block User</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUserAction(user._id, "unblock")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 w-full text-left transition-colors"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Unblock User</span>
                    </button>
                  )}
                </div>
                <div className="py-1">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleUserAction(user._id, "make-admin")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 w-full text-left transition-colors"
                    >
                      <Crown className="w-4 h-4" />
                      <span>Make Admin</span>
                    </button>
                  )}
                  {user.role !== "volunteer" && (
                    <button
                      onClick={() =>
                        handleUserAction(user._id, "make-volunteer")
                      }
                      className="flex items-center gap-3 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 w-full text-left transition-colors"
                    >
                      <HandHeart className="w-4 h-4" />
                      <span>Make Volunteer</span>
                    </button>
                  )}
                  {user.role !== "donor" && (
                    <button
                      onClick={() => handleUserAction(user._id, "make-donor")}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 w-full text-left transition-colors"
                    >
                      <UserRound className="w-4 h-4" />
                      <span>Make Donor</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Initialize TanStack Table
  const table = useReactTable({
    data: usersData.users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: usersData.pagination.totalPages,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
  });

  // Mutations with better error handling
  const { mutate: updateUserStatus } = useMutation({
    mutationFn: async ({ id, status }) => {
      try {
        const { data } = await axiosSecure.patch(`/user/${id}/status`, {
          status,
        });
        return data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to update user status"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      toast.success("User status updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateUserRole } = useMutation({
    mutationFn: async ({ id, role }) => {
      try {
        const { data } = await axiosSecure.patch(`/user/${id}/role`, {
          role,
        });
        return data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to update user role"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      toast.success("User role updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUserAction = async (id, action) => {
    const actionMap = {
      block: {
        title: "Block User",
        text: "This user will no longer be able to access their account.",
        status: "blocked",
      },
      unblock: {
        title: "Unblock User",
        text: "This user will regain access to their account.",
        status: "active",
      },
      "make-admin": {
        title: "Make Admin",
        text: "This user will have full administrative privileges.",
        role: "admin",
      },
      "make-volunteer": {
        title: "Make Volunteer",
        text: "This user will be granted volunteer permissions.",
        role: "volunteer",
      },
      "make-donor": {
        title: "Make Donor",
        text: "This user will be marked as a blood donor.",
        role: "donor",
      },
    };

    const config = actionMap[action];

    const result = await Swal.fire({
      title: config?.title || "Confirm Action",
      text: config?.text || "Are you sure you want to perform this action?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      background:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "#1f2937"
          : "#ffffff",
      color:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "#ffffff"
          : "#000000",
    });

    if (result.isConfirmed) {
      try {
        if (action === "block" || action === "unblock") {
          updateUserStatus({ id, status: config.status });
        } else {
          updateUserRole({ id, role: config.role });
        }
        setActiveMenu(null);
      } catch (error) {
        toast.error("Something went wrong!");
        console.error(error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">
          <div className="flex flex-col items-center text-center gap-3">
            <Ban className="w-10 h-10 text-red-500 dark:text-red-400" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Failed to load users
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300">
              {error.message}
            </p>
            <button
              onClick={() => queryClient.refetchQueries(["all-users"])}
              className="mt-2 px-4 py-2 text-sm font-medium rounded-md bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <span>User Management</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all registered users and their permissions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 shadow-sm text-gray-700 dark:text-gray-300"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 shadow-sm appearance-none text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Shield className="w-4 h-4 text-gray-400" />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 shadow-sm appearance-none text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="volunteer">Volunteer</option>
                <option value="donor">Donor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {usersData.users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <UserRound className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No users found matching your criteria
                      </p>
                      <button
                        onClick={() => {
                          setStatusFilter("all");
                          setRoleFilter("all");
                          setSearchQuery("");
                        }}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {usersData.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {Math.min(page * limit, usersData.pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {usersData.pagination.total}
              </span>{" "}
              users
            </div>

            <Pagination
              currentPage={page}
              totalPages={usersData.pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
