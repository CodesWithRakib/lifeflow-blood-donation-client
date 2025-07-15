import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import useAxios from "../../hooks/useAxios";
import BlogCard from "./BlogCard";
import BlogCardSkeleton from "./BlogCardSkeleton";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const axiosSecure = useAxios();

  // Get query parameters or use defaults
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "published";
  const sort = searchParams.get("sort") || "-createdAt";
  const limit = 9;

  // State for UI controls
  const [localSearch, setLocalSearch] = useState(search);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch blogs using TanStack Query
  const {
    data: blogsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blogs", { page, search, status, sort }],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/blogs?page=${page}&limit=${limit}&search=${search}&status=${status}&sort=${sort}`
      );
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle search with debounce
  const handleSearch = (e) => {
    const newSearch = e.target.value;
    setLocalSearch(newSearch);

    const timer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          prev.set("search", newSearch);
          prev.set("page", "1");
          return prev;
        },
        { replace: true }
      );
    }, 500);

    return () => clearTimeout(timer);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setSearchParams(
      (prev) => {
        prev.set(filterName, value);
        prev.set("page", "1");
        return prev;
      },
      { replace: true }
    );
  };

  // Handle page navigation
  const handlePageChange = (newPage) => {
    setSearchParams(
      (prev) => {
        prev.set("page", newPage.toString());
        return prev;
      },
      { replace: true }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchParams(
      { page: "1", status: "published", sort: "-createdAt" },
      { replace: true }
    );
    setLocalSearch("");
    setShowFilters(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        {isLoading ? (
          <>
            <Skeleton
              height={40}
              width={300}
              className="mx-auto mb-3 dark:bg-gray-700"
            />
            <Skeleton
              height={24}
              width={400}
              className="mx-auto dark:bg-gray-700"
            />
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Our Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover insightful articles, news, and stories from our community
            </p>
          </>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, content, or author..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={localSearch}
              onChange={handleSearch}
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch("");
                  setSearchParams(
                    (prev) => {
                      prev.delete("search");
                      return prev;
                    },
                    { replace: true }
                  );
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md bg-white dark:bg-gray-800"
                  value={status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="all">All</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md bg-white dark:bg-gray-800"
                  value={sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="-views">Most Viewed</option>
                  <option value="views">Least Viewed</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(search || status !== "published" || sort !== "-createdAt") && (
        <div className="mb-6 flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              Search: {search}
              <button
                onClick={() => {
                  setLocalSearch("");
                  setSearchParams(
                    (prev) => {
                      prev.delete("search");
                      return prev;
                    },
                    { replace: true }
                  );
                }}
                className="ml-1.5 inline-flex items-center justify-center text-amber-500 hover:text-amber-700"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {status !== "published" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Status: {status}
              <button
                onClick={() => handleFilterChange("status", "published")}
                className="ml-1.5 inline-flex items-center justify-center text-blue-500 hover:text-blue-700"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {sort !== "-createdAt" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Sort:{" "}
              {sort === "createdAt"
                ? "Oldest"
                : sort === "-views"
                ? "Most Viewed"
                : "Least Viewed"}
              <button
                onClick={() => handleFilterChange("sort", "-createdAt")}
                className="ml-1.5 inline-flex items-center justify-center text-purple-500 hover:text-purple-700"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, index) => (
            <BlogCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="py-10">
          <ErrorMessage
            message={error.response?.data?.message || "Failed to load blogs"}
            onRetry={() => window.location.reload()}
          />
        </div>
      )}

      {/* Blog List */}
      {blogsData && (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {blogsData.data.length > 0 ? (
              blogsData.data.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  {search
                    ? "No blogs match your search criteria"
                    : "No blogs available"}
                </div>
                {search && (
                  <button
                    onClick={() => {
                      setSearchParams(
                        { page: "1", search: "" },
                        { replace: true }
                      );
                      setLocalSearch("");
                    }}
                    className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {blogsData.totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing page {page} of {blogsData.totalPages} •{" "}
                {blogsData.total} total blogs
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <FiChevronLeft />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, blogsData.totalPages) },
                    (_, i) => {
                      // Calculate page numbers to show (current page in middle when possible)
                      let pageNum;
                      if (blogsData.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= blogsData.totalPages - 2) {
                        pageNum = blogsData.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-md flex items-center justify-center ${
                            page === pageNum
                              ? "bg-amber-500 text-white"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === blogsData.totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Next
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Blogs;
