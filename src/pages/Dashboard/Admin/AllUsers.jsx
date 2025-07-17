import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  MoreVertical,
  Lock,
  Unlock,
  Loader2,
  Mail,
  UserRound,
  CheckCircle,
  Ban,
  Crown,
  HandHeart,
  Shield,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  const [page, setPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const limit = 10;

  useTitle("All Users | LifeFlow - Blood Donation");

  // Fetch users
  const {
    data: usersData = {
      users: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["all-users", statusFilter, page],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/users?status=${
          statusFilter === "all" ? "" : statusFilter
        }&page=${page}&limit=${limit}`
      );
      return data;
    },
    keepPreviousData: true,
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
                className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow"
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=random`
                }
                alt={user.name}
              />
              {user.role === "admin" && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
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
              <Mail className="w-4 h-4 text-purple-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {user.email}
              </span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-blue-400"
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
              <Crown className="w-5 h-5 text-yellow-500" />
            ) : user.role === "volunteer" ? (
              <HandHeart className="w-5 h-5 text-green-500" />
            ) : (
              <UserRound className="w-5 h-5 text-blue-500" />
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                user.role === "admin"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : user.role === "volunteer"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
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
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Ban className="w-5 h-5 text-red-500" />
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                user.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
          <div className="relative flex justify-end">
            <button
              onClick={() =>
                setActiveMenu(activeMenu === user._id ? null : user._id)
              }
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {activeMenu === user._id && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-100 dark:border-gray-700">
                <div className="py-1">
                  {user.status === "active" ? (
                    <button
                      onClick={() => {
                        handleAction(user._id, "block");
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 w-full text-left transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Block User</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleAction(user._id, "unblock");
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50 w-full text-left transition-colors"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Unblock User</span>
                    </button>
                  )}
                  {user.role !== "admin" && (
                    <button
                      onClick={() => {
                        handleAction(user._id, "make-admin");
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/50 w-full text-left transition-colors"
                    >
                      <Crown className="w-4 h-4" />
                      <span>Make Admin</span>
                    </button>
                  )}
                  {user.role !== "volunteer" && (
                    <button
                      onClick={() => {
                        handleAction(user._id, "make-volunteer");
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 w-full text-left transition-colors"
                    >
                      <HandHeart className="w-4 h-4" />
                      <span>Make Volunteer</span>
                    </button>
                  )}
                  {user.role !== "donor" && (
                    <button
                      onClick={() => {
                        handleAction(user._id, "make-donor");
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 w-full text-left transition-colors"
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

  // Mutations
  const { mutate: updateUserStatus } = useMutation({
    mutationFn: async ({ id, status }) => {
      await axiosSecure.patch(`/user/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      toast.success("User status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const { mutate: updateUserRole } = useMutation({
    mutationFn: async ({ id, role }) => {
      await axiosSecure.patch(`/user/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      toast.success("User role updated");
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  const handleAction = async (id, action) => {
    const actionMap = {
      block: {
        title: "Block User",
        text: "Are you sure you want to block this user?",
        status: "blocked",
      },
      unblock: {
        title: "Unblock User",
        text: "Are you sure you want to unblock this user?",
        status: "active",
      },
      "make-admin": {
        title: "Make Admin",
        text: "Are you sure you want to make this user an admin?",
        role: "admin",
      },
      "make-volunteer": {
        title: "Make Volunteer",
        text: "Are you sure you want to make this user a volunteer?",
        role: "volunteer",
      },
      "make-donor": {
        title: "Make Donor",
        text: "Are you sure you want to make this user a donor?",
        role: "donor",
      },
    };

    const confirm = await Swal.fire({
      title: actionMap[action]?.title || "Confirm Action",
      text: actionMap[action]?.text || "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
    });

    if (confirm.isConfirmed) {
      if (action === "block" || action === "unblock") {
        updateUserStatus({ id, status: actionMap[action].status });
      } else {
        updateUserRole({ id, role: actionMap[action].role });
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 dark:text-red-400">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            User Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all registered users and their permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
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
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
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
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserRound className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * limit, usersData.pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{usersData.pagination.total}</span>{" "}
              users
            </div>

            {/* Reusable Pagination Component */}
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
