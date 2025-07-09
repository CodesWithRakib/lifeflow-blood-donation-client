// src/pages/Blogs.jsx
import { useEffect, useState, useMemo } from "react";
import BlogCard from "../../components/Blogs/BlogCard";
import useAxios from "../../hooks/useAxios";

const Blogs = () => {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });
  const axiosSecure = useAxios();

  // Memoized filtered blogs for client-side search fallback
  const filteredBlogs = useMemo(() => {
    if (!search) return blogs;
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [blogs, search]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(
          `/api/blogs?page=${pagination.page}&limit=${pagination.limit}&search=${search}`
        );
        setBlogs(response.data.data);
        setPagination({
          ...pagination,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [axiosSecure, pagination.page, search]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-600 mb-6">Blog Articles</h1>

      <input
        type="text"
        placeholder="Search blogs by title or author..."
        className="w-full mb-6 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPagination({ ...pagination, page: 1 }); // Reset to first page on new search
        }}
      />

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
          <p className="text-gray-500 mt-2">Loading blogs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.length ? (
              filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onClick={async () => {
                    try {
                      await axiosSecure.patch(`/api/blogs/${blog._id}/views`);
                      // Optionally update local state if you want immediate UI feedback
                      setBlogs((prevBlogs) =>
                        prevBlogs.map((b) =>
                          b._id === blog._id ? { ...b, views: b.views + 1 } : b
                        )
                      );
                    } catch (error) {
                      console.error("Failed to track view:", error);
                      // You might want to add user feedback here
                    }
                  }}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">
                {search ? "No matching blogs found." : "No blogs available."}
              </p>
            )}
          </div>

          {/* Pagination controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Blogs;
