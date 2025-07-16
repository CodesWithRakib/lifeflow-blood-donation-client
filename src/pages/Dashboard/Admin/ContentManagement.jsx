import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import useRole from "../../../hooks/useRole";
import useAxios from "../../../hooks/useAxios";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";

const StatusBadge = ({ status }) => {
  const base = "px-2 py-1 text-xs font-medium rounded-full";
  if (status === "published") {
    return (
      <span
        className={`${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}
      >
        Published
      </span>
    );
  } else if (status === "draft") {
    return (
      <span
        className={`${base} bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200`}
      >
        Draft
      </span>
    );
  } else {
    return (
      <span
        className={`${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}
      >
        {status}
      </span>
    );
  }
};

const fetchBlogs = async (page, limit, search, status, axiosSecure) => {
  const params = { page, limit, search, sort: "-createdAt", status };
  const res = await axiosSecure.get("/blogs", { params });
  return res.data;
};

const ContentManagement = () => {
  const { isAdmin, isVolunteer } = useRole();
  const queryClient = useQueryClient();
  const axiosSecure = useAxios();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blogs", page, search, status],
    queryFn: () => fetchBlogs(page, limit, search, status, axiosSecure),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/blogs/${id}`),
    onSuccess: () => {
      toast.success("Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete blog");
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id) => {
      const currentStatus = data?.data.find((blog) => blog._id === id)?.status;
      const newStatus = currentStatus === "published" ? "draft" : "published";
      return await axiosSecure.patch(`/blogs/${id}/status`, {
        status: newStatus,
      });
    },
    onSuccess: () => {
      toast.success("Blog status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update blog status"
      );
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Blog?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });
    if (result.isConfirmed) deleteMutation.mutate(id);
  };

  const handlePublishToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    const result = await Swal.fire({
      title: `${newStatus === "published" ? "Publish" : "Unpublish"} Blog?`,
      text: `This will change the blog status to ${newStatus}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${
        newStatus === "published" ? "Publish" : "Unpublish"
      }`,
    });
    if (result.isConfirmed) publishMutation.mutate(id);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center">
            <img
              src={row.original.thumbnail}
              alt={row.original.title}
              className="h-10 w-10 rounded-md object-cover mr-4"
              onError={(e) => (e.target.src = "/default-thumbnail.png")}
            />
            <span className="text-sm font-medium dark:text-white line-clamp-2">
              {row.original.title}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "author",
        header: "Author",
        cell: ({ row }) => (
          <div className="flex items-center">
            <img
              src={row.original.authorImage || "/default-avatar.png"}
              alt={row.original.author}
              className="h-8 w-8 rounded-full object-cover mr-3"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
            <span className="text-sm dark:text-white">
              {row.original.author}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) =>
          isAdmin ? (
            <button
              disabled={!isAdmin}
              onClick={() =>
                handlePublishToggle(row.original._id, row.original.status)
              }
              title={`${
                row.original.status === "published" ? "Unpublish" : "Publish"
              } Blog`}
              className={`hover:opacity-80 transition-opacity ${
                isAdmin ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            >
              <StatusBadge status={row.original.status} />
            </button>
          ) : (
            <StatusBadge status={row.original.status} />
          ),
      },
      {
        accessorKey: "views",
        header: "Views",
        cell: ({ row }) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {row.original.views?.toLocaleString()}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end space-x-3">
            <Link
              to={`/dashboard/content-management/edit-blog/${row.original._id}`}
              title="Edit"
            >
              <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </Link>
            <Link
              to={`/dashboard/content-management/blog-preview/${row.original._id}`}
              title="Preview"
            >
              <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            {isAdmin && (
              <button
                onClick={() => handleDelete(row.original._id)}
                title="Delete"
              >
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [isAdmin]
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.totalPages || 0,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    onPaginationChange: (updater) => {
      const newState = updater({
        pageIndex: page - 1,
        pageSize: limit,
      });
      setPage(newState.pageIndex + 1);
    },
  });

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Content Management
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage all your blog content in one place
        </p>
        {isVolunteer && (
          <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            Volunteer mode: You cannot delete or change publication status of
            blogs
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search title, content, or author..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <Link
            to="/dashboard/content-management/add-blog"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            New Blog
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-12">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="p-12 text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <AlertTriangle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Error loading blogs
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {error.message || "Failed to load blog data"}
            </p>
            <button
              onClick={() => queryClient.refetchQueries(["blogs"])}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : data?.data?.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap"
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
            {data?.totalPages > 1 && (
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(p + 1, data.totalPages))
                    }
                    disabled={page === data.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                        {Math.min(page * limit, data.total)}
                      </span>{" "}
                      of <span className="font-medium">{data.total}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from(
                        { length: Math.min(5, data.totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (data.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= data.totalPages - 2) {
                            pageNum = data.totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                                page === pageNum
                                  ? "z-10 bg-red-50 dark:bg-red-900 border-red-500 dark:border-red-600 text-red-600 dark:text-red-300"
                                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(p + 1, data.totalPages))
                        }
                        disabled={page === data.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No blogs found"
            description="Try adjusting your search or filter criteria"
            actionText="Create New Blog"
            actionLink="/dashboard/content-management/add-blog"
          />
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
