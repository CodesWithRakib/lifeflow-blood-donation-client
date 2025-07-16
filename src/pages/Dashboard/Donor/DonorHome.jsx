import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import useAuth from "../../../hooks/useAuth";
import { format } from "date-fns";
import {
  Droplet,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Clock,
  Calendar,
  HeartPulse,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useUser } from "../../../hooks/useUser";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useMemo } from "react";

const DonorHome = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const { data: userData } = useUser();

  const {
    data: donationRequests,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["recentDonations", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/donations/recent/${user?.email}`
      );
      return data;
    },
    enabled: !!user?.email,
  });

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const toastId = toast.loading("Updating status...");
      const { data } = await axiosSecure.patch(`/donations/status/${id}`, {
        status: newStatus,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to update status");
      }

      toast.success(`Donation status updated to ${newStatus}`, { id: toastId });
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteRequest = async (id) => {
    Swal.fire({
      title: "Delete Donation Request?",
      text: "This will permanently remove this request. Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "#1f2937"
          : "#fff",
      color:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "#fff"
          : "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const toastId = toast.loading("Deleting request...");
          const { data } = await axiosSecure.delete(`/donations/${id}`);

          if (!data.success) {
            throw new Error(
              data.message || "Failed to delete donation request"
            );
          }

          toast.success("Donation request deleted successfully", {
            id: toastId,
          });
          refetch();
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };

  const statusStyles = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    inprogress:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    done: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    canceled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "recipientName",
        header: "Recipient",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {row.original.recipientName}
          </span>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>
              {row.original.recipientDistrict}, {row.original.recipientUpazila}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "dateTime",
        header: "Date/Time",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>{format(new Date(row.original.date), "MMM dd")}</span>
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{row.original.time}</span>
          </div>
        ),
      },
      {
        accessorKey: "bloodGroup",
        header: "Blood Group",
        cell: ({ row }) => (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-1 w-min">
            <Droplet className="w-3 h-3" />
            {row.original.bloodGroup}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                statusStyles[row.original.status]
              } flex items-center gap-1 w-min`}
            >
              {row.original.status === "pending" && (
                <Clock className="w-3 h-3" />
              )}
              {row.original.status === "inprogress" && (
                <HeartPulse className="w-3 h-3" />
              )}
              {row.original.status === "done" && (
                <CheckCircle className="w-3 h-3" />
              )}
              {row.original.status === "canceled" && (
                <XCircle className="w-3 h-3" />
              )}
              {row.original.status.charAt(0).toUpperCase() +
                row.original.status.slice(1)}
            </span>
            {row.original.status === "inprogress" && row.original.donor && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <div>Donor: {row.original.donor.name}</div>
                <div className="truncate max-w-[180px]">
                  {row.original.donor.email}
                </div>
              </div>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() =>
                navigate(`/dashboard/donation-request/${row.original._id}`)
              }
              className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                navigate(`/dashboard/edit-donation/${row.original._id}`)
              }
              className="p-1.5 rounded-full text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/50 transition-colors"
              title="Edit request"
            >
              <Edit className="w-4 h-4" />
            </button>
            {row.original.status === "inprogress" && (
              <>
                <button
                  onClick={() => handleStatusUpdate(row.original._id, "done")}
                  className="p-1.5 rounded-full text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
                  title="Mark as completed"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(row.original._id, "canceled")
                  }
                  className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                  title="Cancel request"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => handleDeleteRequest(row.original._id)}
              className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
              title="Delete request"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: donationRequests?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="text-red-500 dark:text-red-400 p-4">
        Error loading donation requests
      </div>
    );

  return (
    <div className="w-full  space-y-6">
      {/* Welcome + Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Welcome Section */}
        <div className="col-span-2 p-6 rounded-xl bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 shadow-lg border border-amber-200 dark:border-amber-800/50">
          <div className="flex items-center gap-4">
            <img
              src={user?.photoURL || "/default-avatar.png"}
              alt="User Avatar"
              className="w-16 h-16 rounded-full border-4 border-amber-500/30 dark:border-amber-400/30 shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-amber-50">
                Welcome back, {user?.displayName}!
              </h1>
              <p className="text-gray-600 dark:text-amber-100/80 capitalize flex items-center gap-1 mt-1">
                <HeartPulse className="w-4 h-4" />
                <span>Blood Donor Hero</span>
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <span>Your Info</span>
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <Droplet className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Blood Group
              </p>
              <p className="font-medium">
                {userData?.bloodGroup || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <MapPin className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Location
              </p>
              <p className="font-medium">
                {userData?.district || "Unknown"},{" "}
                {userData?.upazila || "Unknown"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                userData?.status === "active"
                  ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                  : "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
              }`}
            >
              {userData?.status === "active" ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
              <p className="font-medium capitalize">
                {userData?.status || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donation Requests */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Droplet className="w-5 h-5 text-red-500" />
            <span>Your Recent Donation Requests</span>
          </h2>
          <Link
            to="/dashboard/my-donation-requests"
            className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm"
          >
            View All Requests
          </Link>
        </div>

        {donationRequests?.data?.length > 0 ? (
          <>
            <div className="w-full overflow-x-auto">
              <table className="min-w-[800px] w-full text-sm text-left">
                <thead className="bg-amber-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 border-b border-gray-200 dark:border-gray-600"
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
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-gray-200"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {table.getRowModel().rows.length} of{" "}
                {donationRequests.data.length} requests
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border dark:text-white border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border dark:text-white border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Droplet className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No donation requests yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              When you create donation requests, they'll appear here for easy
              tracking.
            </p>
            <Link
              to="/dashboard/create-donation-request"
              className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              Create Your First Request
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorHome;
