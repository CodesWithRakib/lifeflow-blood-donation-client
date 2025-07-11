import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import useAxios from "../../hooks/useAxios";
import {
  Bookmark,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";
import BlogComment from "../../components/Blogs/BlogComment";
import DOMPurify from "dompurify";

const ErrorMessage = ({
  message = "An unexpected error occurred",
  onRetry,
  onNavigate,
  navigateText = "Go Back",
  retryText = "Try Again",
}) => (
  <div className="max-w-3xl mx-auto px-4 py-12 text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
      <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
      Something went wrong
    </h2>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{message}</p>
    <div className="flex flex-wrap justify-center gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
        >
          {retryText}
        </button>
      )}
      {onNavigate && (
        <button
          onClick={onNavigate}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {navigateText}
        </button>
      )}
    </div>
  </div>
);

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = () => setHasError(true);
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  return hasError ? <ErrorMessage /> : children;
};

const BlogPreview = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  const fetchBlog = async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosSecure.get(`/api/blogs/${id}`, { signal });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load blog");
      }

      setBlog(response.data.data);
      setIsBookmarked(response.data.data.isBookmarked || false);
      setIsLiked(response.data.data.isLiked || false);
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Error fetching blog:", error);
        setError(
          error.message || "Failed to load blog. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchBlog(controller.signal);
    return () => controller.abort();
  }, [axiosSecure, id]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like this blog");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    try {
      const response = await axiosSecure.patch(`/api/blogs/${id}/like`);
      setIsLiked(response.data.isLiked);
      setBlog((prev) => ({
        ...prev,
        likesCount: response.data.likesCount,
      }));
      toast[response.data.isLiked ? "success" : "info"](
        response.data.isLiked ? "Blog liked!" : "Like removed"
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like blog");
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark this blog");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    try {
      const response = await axiosSecure.patch(`/api/blogs/${id}/bookmark`);
      setIsBookmarked(response.data.isBookmarked);
      toast[response.data.isBookmarked ? "success" : "info"](
        response.data.isBookmarked ? "Blog bookmarked!" : "Bookmark removed"
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to bookmark blog");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || `Check out this blog: ${blog.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (!navigator.share) {
        toast.error("Failed to copy link");
      }
    }
  };

  const formatDate = useMemo(() => {
    return blog
      ? new Date(blog.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";
  }, [blog?.createdAt]);

  const readingTime = useMemo(() => {
    return blog ? Math.ceil(blog.content.split(/\s+/).length / 200) || 1 : 1;
  }, [blog?.content]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error)
    return <ErrorMessage message={error} onRetry={() => fetchBlog()} />;
  if (!blog)
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
          Blog not found
        </h2>
        <button
          onClick={() => navigate("/blogs")}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          Browse All Blogs
        </button>
      </div>
    );

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 text-sm text-gray-600 dark:text-gray-400"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                to="/"
                className="hover:underline hover:text-amber-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                to="/blogs"
                className="hover:underline hover:text-amber-600 transition-colors"
              >
                Blogs
              </Link>
            </li>
            <li>/</li>
            <li className="text-amber-600 truncate max-w-xs">{blog.title}</li>
          </ol>
        </nav>

        {/* Blog Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {blog.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span>{blog.views || 0} views</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Published: {formatDate}
              </span>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
              <img
                src={blog.authorImage || "/default-avatar.png"}
                alt={blog.author}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {blog.author}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {blog.authorBio || "Blog Writer"}
              </p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {blog.thumbnail && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-auto max-h-[500px] object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Blog Content */}
        <article className="prose dark:prose-invert max-w-none mb-12">
          {blog.excerpt && (
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
              {blog.excerpt}
            </p>
          )}
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />
        </article>

        {/* Tags Section */}
        {blog.tags?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Tags:
            </h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blogs?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 border-t border-b border-gray-200 dark:border-gray-700 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              aria-label={isLiked ? "Unlike blog" : "Like blog"}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart
                className="w-5 h-5"
                fill={isLiked ? "currentColor" : "none"}
              />
              <span>{blog.likesCount || blog.likes?.length || 0}</span>
            </button>

            <button
              className="flex items-center space-x-1 text-gray-500 hover:text-amber-500 transition-colors"
              aria-label="View comments"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{blog.comments?.length || 0}</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleBookmark}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark blog"}
              className={`transition-colors ${
                isBookmarked
                  ? "text-amber-500"
                  : "text-gray-500 hover:text-amber-500"
              }`}
            >
              <Bookmark
                className="w-5 h-5"
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>

            <button
              onClick={handleShare}
              className="text-gray-500 hover:text-amber-500 transition-colors"
              aria-label="Share blog"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Author Bio Section */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            About the Author
          </h3>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
              <img
                src={blog.authorImage || "/default-avatar.png"}
                alt={blog.author}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {blog.author}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {blog.authorBio || "No bio available"}
              </p>
              {blog.authorSocial && (
                <div className="flex gap-4">
                  {blog.authorSocial.twitter && (
                    <a
                      href={blog.authorSocial.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-amber-500 transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                  {blog.authorSocial.linkedin && (
                    <a
                      href={blog.authorSocial.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-amber-500 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Comments Section */}
        <BlogComment blogId={id} comments={blog.comments || []} />
      </div>
    </ErrorBoundary>
  );
};

export default BlogPreview;
