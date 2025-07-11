import { useState } from "react";
import { Link } from "react-router";
import { PlusCircle, Search, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/useAxios";

const fetchBlogs = async (page, limit, search, status, axiosSecure) => {
  const res = await axiosSecure.get("/api/blogs", {
    params: {
      page,
      limit,
      search,
      status,
      sort: "-createdAt",
    },
  });
  return res.data;
};

const ContentManagement = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxios();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("published");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blogs", page, search, status],
    queryFn: () => fetchBlogs(page, limit, search, status, axiosSecure),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/api/blogs/${id}`),
    onSuccess: () => {
      toast.success("Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete blog");
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "draft":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Content Management
          </h1>
          <Link
            to="/dashboard/content-management/add-blog"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Add Blog
          </Link>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 border-b dark:border-gray-700">
          <div className="flex items-center w-full sm:w-auto">
            <Search className="mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full sm:w-64 px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" />
            <select
              className="px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              Loading blogs...
            </div>
          ) : isError ? (
            <div className="px-6 py-12 text-center text-red-600 dark:text-red-400">
              Error: {error.message}
            </div>
          ) : data?.data?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.data.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {blog.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {blog.author || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          blog.status
                        )}`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {blog.views?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/dashboard/content-management/edit-blog/${blog._id}`}
                        className="text-amber-600 hover:text-amber-800 dark:hover:text-amber-400"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/dashboard/content-management/blog-preview/${blog._id}`}
                        className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                      >
                        Preview
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No blogs found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.pagination?.totalPages > 1 && (
          <div className="px-6 py-4 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded border bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
            >
              Previous
            </button>
            {[...Array(data.pagination.totalPages).keys()].map((i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 text-sm rounded border ${
                  page === i + 1
                    ? "bg-amber-600 text-white"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, data.pagination.totalPages))
              }
              disabled={page === data.pagination.totalPages}
              className="px-3 py-1 text-sm rounded border bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
