import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  FiCalendar,
  FiClock,
  FiUser,
  FiTag,
  FiBookOpen,
} from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useTitle from "../../hooks/useTitle";
import { motion } from "motion/react";

// Memoized Filter Badge Component
const FilterBadge = React.memo(({ type, value, onRemove }) => {
  const getBadgeStyle = () => {
    switch (type) {
      case "search":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "status":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "sort":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyle()}`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}: {value}
      <button
        onClick={onRemove}
        className="ml-1.5 inline-flex items-center justify-center hover:text-gray-700 dark:hover:text-gray-300"
        aria-label={`Remove ${type} filter`}
      >
        <FiX size={14} />
      </button>
    </span>
  );
});

// Memoized Pagination Component
const Pagination = React.memo(
  ({ currentPage, totalPages, totalItems, onPageChange }) => {
    const getPageNumbers = useMemo(() => {
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      } else if (currentPage <= 3) {
        return [1, 2, 3, 4, 5];
      } else if (currentPage >= totalPages - 2) {
        return [
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        return [
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
        ];
      }
    }, [currentPage, totalPages]);

    return (
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing page {currentPage} of {totalPages} • {totalItems} total blogs
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            aria-label="Previous page"
          >
            <FiChevronLeft />
            Previous
          </button>
          <div className="flex items-center gap-1">
            {getPageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                  currentPage === pageNum
                    ? "bg-amber-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                aria-label={`Page ${pageNum}`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            aria-label="Next page"
          >
            Next
            <FiChevronRight />
          </button>
        </div>
      </div>
    );
  }
);

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
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useTitle("Blogs | LifeFlow - Blood Donation");

  // Fetch blogs using TanStack Query
  const {
    data: blogsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blogs", { page, search: debouncedSearch, status, sort }],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/blogs?page=${page}&limit=${limit}&search=${debouncedSearch}&status=${status}&sort=${sort}`
      );
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(localSearch);
      setSearchParams(
        (prev) => {
          if (localSearch) {
            prev.set("search", localSearch);
          } else {
            prev.delete("search");
          }
          prev.set("page", "1");
          return prev;
        },
        { replace: true }
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchParams]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filterName, value) => {
      setSearchParams(
        (prev) => {
          prev.set(filterName, value);
          prev.set("page", "1");
          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Handle page navigation
  const handlePageChange = useCallback(
    (newPage) => {
      setSearchParams(
        (prev) => {
          prev.set("page", newPage.toString());
          return prev;
        },
        { replace: true }
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setSearchParams]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchParams(
      { page: "1", status: "published", sort: "-createdAt" },
      { replace: true }
    );
    setLocalSearch("");
    setShowFilters(false);
  }, [setSearchParams]);

  // Clear search
  const clearSearch = useCallback(() => {
    setLocalSearch("");
  }, []);

  // Clear status filter
  const clearStatusFilter = useCallback(() => {
    handleFilterChange("status", "published");
  }, [handleFilterChange]);

  // Clear sort filter
  const clearSortFilter = useCallback(() => {
    handleFilterChange("sort", "-createdAt");
  }, [handleFilterChange]);

  // Active filters
  const activeFilters = useMemo(() => {
    const filters = [];
    if (search)
      filters.push({ type: "search", value: search, onRemove: clearSearch });
    if (status !== "published")
      filters.push({
        type: "status",
        value: status,
        onRemove: clearStatusFilter,
      });
    if (sort !== "-createdAt")
      filters.push({
        type: "sort",
        value:
          sort === "createdAt"
            ? "Oldest"
            : sort === "-views"
            ? "Most Viewed"
            : "Least Viewed",
        onRemove: clearSortFilter,
      });
    return filters;
  }, [search, status, sort, clearSearch, clearStatusFilter, clearSortFilter]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton
              height={40}
              width={300}
              className="mx-auto dark:bg-gray-700"
            />
            <Skeleton
              height={24}
              width={400}
              className="mx-auto dark:bg-gray-700"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-6">
              <FiBookOpen className="w-4 h-4 mr-2" />
              Knowledge Center
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Blood Donation Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover insightful articles, news, and stories from our community
            </p>
          </motion.div>
        )}
      </div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, content, or author..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              aria-label="Search blogs"
            />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            aria-expanded={showFilters}
            aria-controls="filters-panel"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            id="filters-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
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
                  aria-label="Filter by status"
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
                  aria-label="Sort blogs"
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
                  aria-label="Reset all filters"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {activeFilters.map((filter, index) => (
            <FilterBadge
              key={`${filter.type}-${index}`}
              type={filter.type}
              value={filter.value}
              onRemove={filter.onRemove}
            />
          ))}
        </motion.div>
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
              blogsData.data.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <FiBookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  {search
                    ? "No blogs match your search criteria"
                    : "No blogs available"}
                </div>
                {search && (
                  <button
                    onClick={clearSearch}
                    className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Pagination */}
          {blogsData.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={blogsData.totalPages}
              totalItems={blogsData.total}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Blogs;
