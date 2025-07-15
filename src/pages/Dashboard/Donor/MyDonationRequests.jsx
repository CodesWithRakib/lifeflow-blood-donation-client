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

const MySwal = withReactContent(Swal);

const statusOptions = [
  { value: "all", label: "All Requests" },
  { value: "pending", label: "Pending" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Completed" },
  { value: "canceled", label: "Canceled" },
];

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  inprogress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
  canceled: "bg-gray-100 text-gray-800",
};

const MyDonationRequests = () => {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 8;

  const axiosSecure = useAxios();
  const { user } = useAuth();
  console.log(user?.email);

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

  console.log(response);

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
    <div className="max-w-7xl mx-auto  ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Donation Requests
          </h1>
          <p className="text-gray-500 mt-1">
            {pagination.totalItems || 0} request(s) found
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:ring-amber-500 focus:border-amber-500"
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
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Recipient
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Location
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Date
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Time
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Droplet className="w-4 h-4 mr-1" />
                      Blood Group
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {req.recipientName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {req.district}, {req.upazila}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {format(new Date(req.date), "MMM dd, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{req.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {req.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusStyles[req.status]
                        }`}
                      >
                        {req.status.charAt(0).toUpperCase() +
                          req.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-3">
                        {req.status === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "done")
                              }
                              className="text-green-600 hover:text-green-800"
                              title="Mark as completed"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "canceled")
                              }
                              className="text-red-600 hover:text-red-800"
                              title="Cancel request"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/dashboard/edit-donation/${req._id}`}
                          className="text-amber-600 hover:text-amber-800"
                          title="Edit request"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <Link
                          onClick={() => handleDelete(req._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete request"
                        >
                          <Trash className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/dashboard/donation-details/${req._id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNext}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
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
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
                                ? "z-10 bg-amber-50 border-amber-500 text-amber-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
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
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
