import { useState } from "react";
import { Link } from "react-router";
import {
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Droplet,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  User,
  HeartPulse,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "date-fns";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import useTitle from "../../../hooks/useTitle";

const MySwal = withReactContent(Swal);

const statusOptions = [
  { value: "all", label: "All Requests" },
  { value: "pending", label: "Pending" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Completed" },
  { value: "canceled", label: "Canceled" },
];

const statusStyles = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  inprogress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  canceled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

const bloodGroupStyles =
  "px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";

const MyDonationRequests = () => {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const limit = 8;

  const axiosSecure = useAxios();
  const { user } = useAuth();

  useTitle("My Donation Requests");
  const {
    data: response = {},
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["my-donation-requests", user?.email, filter, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donations/${user?.email}/my-requests`,
        {
          params: {
            status: filter !== "all" ? filter : undefined,
            page,
            limit,
          },
        }
      );
      return res.data;
    },
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  const requests = response.data || [];
  const pagination = response.pagination || {};

  const handleStatusChange = async (id, newStatus) => {
    try {
      const toastId = toast.loading("Updating status...");
      await axiosSecure.patch(`/donations/status/${id}`, {
        status: newStatus,
      });
      toast.success(`Request marked as ${newStatus}`, { id: toastId });
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Delete Donation Request?",
      text: "This action cannot be undone. All related data will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete Request",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: document.documentElement.classList.contains("dark")
        ? "#1f2937"
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#e5e7eb"
        : "#111827",
    });

    if (result.isConfirmed) {
      try {
        const toastId = toast.loading("Deleting request...");
        await axiosSecure.delete(`/donations/${id}`);
        toast.success("Request deleted successfully", { id: toastId });
        refetch();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete request"
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Error loading requests"
        description="Failed to load your donation requests. Please try again later."
        actionText="Retry"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Donation Requests
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {pagination.totalItems || 0} request(s) found
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-amber-500 focus:border-amber-500 w-full sm:w-auto"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {requests.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Recipient
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                      Location
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                      Date
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                      Time
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Droplet className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                      Blood Group
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {req.recipientName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {req._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {req.recipientDistrict}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {req.recipientUpazila}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {format(new Date(req.date), "MMM dd, yyyy")}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {req.time}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-1.5 w-min">
                        <Droplet className="w-3.5 h-3.5" />
                        {req.bloodGroup}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                            statusStyles[req.status]
                          }`}
                        >
                          {req.status === "pending" && (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          {req.status === "inprogress" && (
                            <HeartPulse className="w-3.5 h-3.5" />
                          )}
                          {req.status === "done" && (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          {req.status === "canceled" && (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <Link
                          to={`/dashboard/donation-details/${req._id}`}
                          className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>

                        <Link
                          to={`/dashboard/edit-donation/${req._id}`}
                          className="p-1.5 rounded-full text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30 transition-colors"
                          title="Edit request"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>

                        {req.status === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "done")
                              }
                              className="p-1.5 rounded-full text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 transition-colors"
                              title="Mark as completed"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "canceled")
                              }
                              className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                              title="Cancel request"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete request"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {req.recipientName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="inline w-3 h-3 mr-1" />
                      {req.district}, {req.upazila}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setMobileMenuOpen(
                          mobileMenuOpen === req._id ? null : req._id
                        )
                      }
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {mobileMenuOpen === req._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                        <div className="py-1">
                          {req.status === "inprogress" && (
                            <>
                              <button
                                onClick={() => {
                                  handleStatusChange(req._id, "done");
                                  setMobileMenuOpen(null);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as completed
                              </button>
                              <button
                                onClick={() => {
                                  handleStatusChange(req._id, "canceled");
                                  setMobileMenuOpen(null);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel request
                              </button>
                            </>
                          )}
                          <Link
                            to={`/dashboard/edit-donation/${req._id}`}
                            className="flex items-center px-4 py-2 text-sm text-amber-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            onClick={() => setMobileMenuOpen(null)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit request
                          </Link>
                          <button
                            onClick={() => {
                              handleDelete(req._id);
                              setMobileMenuOpen(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete request
                          </button>
                          <Link
                            to={`/dashboard/donation-details/${req._id}`}
                            className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            onClick={() => setMobileMenuOpen(null)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View details
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Date
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="inline w-3 h-3 mr-1" />
                      {format(new Date(req.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Time
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <Clock className="inline w-3 h-3 mr-1" />
                      {req.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Blood Group
                    </p>
                    <p className="text-sm">
                      <span className={bloodGroupStyles}>{req.bloodGroup}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Status
                    </p>
                    <p className="text-sm">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusStyles[req.status]
                        }`}
                      >
                        {req.status.charAt(0).toUpperCase() +
                          req.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNext}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">
                      {(page - 1) * limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(page * limit, pagination.totalItems)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{pagination.totalItems}</span>{" "}
                    requests
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pageNum
                                ? "z-10 bg-amber-50 dark:bg-amber-900/30 border-amber-500 dark:border-amber-500 text-amber-600 dark:text-amber-400"
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pagination.hasNext}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No donation requests found"
          description={
            filter === "all"
              ? "You haven't made any donation requests yet."
              : `You don't have any ${filter} donation requests.`
          }
          actionText={filter !== "all" ? "View all requests" : undefined}
          onAction={filter !== "all" ? () => setFilter("all") : undefined}
        />
      )}
    </div>
  );
};

export default MyDonationRequests;
