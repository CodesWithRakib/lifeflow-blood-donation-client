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
  User as UserIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "date-fns";
import useAxios from "../../../hooks/useAxios";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import useRole from "../../../hooks/useRole";
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
  canceled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

const AllDonationRequests = () => {
  const [filter, setFilter] = useState("all");
  const axiosSecure = useAxios();
  const { isAdmin, isVolunteer } = useRole();

  useTitle("All Donation Requests | LifeFlow - Blood Donation");

  const {
    data: response = {},
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["all-donation-requests", filter],
    queryFn: async () => {
      const res = await axiosSecure.get("/donations", {
        params: {
          status: filter !== "all" ? filter : undefined,
        },
      });
      return res.data;
    },
  });

  const requests = response.data || [];

  const columns = [
    {
      accessorKey: "requesterName",
      header: () => (
        <div className="flex items-center">
          <UserIcon className="w-4 h-4 mr-1" />
          Requester
        </div>
      ),
      cell: ({ row }) => {
        const req = row.original;
        return (
          <div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {req.requesterName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {req.requesterEmail}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "recipientName",
      header: "Recipient",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {row.original.recipientName}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: () => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          Location
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-gray-500 dark:text-gray-400">
          {row.original.district}, {row.original.upazila}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: () => (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          Date
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-gray-500 dark:text-gray-400">
          {format(new Date(row.original.date), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      accessorKey: "bloodGroup",
      header: () => (
        <div className="flex items-center">
          <Droplet className="w-4 h-4 mr-1" />
          Blood Group
        </div>
      ),
      cell: ({ row }) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          {row.original.bloodGroup}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const req = row.original;
        return (
          <div className="flex justify-end items-center space-x-3">
            {(isAdmin || isVolunteer) && (
              <>
                {req.status === "pending" && (
                  <button
                    onClick={() => handleStatusChange(req._id, "inprogress")}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Mark as in progress"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {req.status === "inprogress" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(req._id, "done")}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      title="Mark as completed"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(req._id, "canceled")}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Cancel request"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to={`/dashboard/edit-donation/${req._id}`}
                  className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
                  title="Edit request"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(req._id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete request"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </>
            )}

            <Link
              to={`/dashboard/donation-details/${req._id}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title="View details"
            >
              <Eye className="w-5 h-5" />
            </Link>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

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
        description="Failed to load donation requests. Please try again later."
        actionText="Retry"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Donation Requests
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {requests.length} request(s) found
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-blue-600 dark:focus:border-blue-600"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
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
        <div className="bg-white shadow-sm rounded-xl overflow-hidden dark:bg-gray-800 dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {table.getHeaderGroups()[0].headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">
                      {table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        (table.getState().pagination.pageIndex + 1) *
                          table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {table.getFilteredRowModel().rows.length}
                    </span>{" "}
                    requests
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from(
                      { length: Math.min(5, table.getPageCount()) },
                      (_, i) => {
                        let pageNum;
                        if (table.getPageCount() <= 5) {
                          pageNum = i + 1;
                        } else if (table.getState().pagination.pageIndex <= 2) {
                          pageNum = i + 1;
                        } else if (
                          table.getState().pagination.pageIndex >=
                          table.getPageCount() - 3
                        ) {
                          pageNum = table.getPageCount() - 4 + i;
                        } else {
                          pageNum =
                            table.getState().pagination.pageIndex - 1 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => table.setPageIndex(pageNum - 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              table.getState().pagination.pageIndex ===
                              pageNum - 1
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
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
              ? "There are no donation requests yet."
              : `There are no ${filter} donation requests.`
          }
          actionText={filter !== "all" ? "View all requests" : undefined}
          onAction={filter !== "all" ? () => setFilter("all") : undefined}
        />
      )}
    </div>
  );
};

export default AllDonationRequests;
