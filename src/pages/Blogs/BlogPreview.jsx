import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  Bookmark,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  AlertTriangle,
  ChevronLeft,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  User,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import DOMPurify from "dompurify";
import BlogComment from "./BlogComment";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useTitle from "../../hooks/useTitle";

// Memoized ErrorMessage Component
const ErrorMessage = React.memo(
  ({
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
  )
);

// Memoized ShareOptions Component
const ShareOptions = React.memo(({ onShare, onClose }) => (
  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
    <div className="p-2">
      <button
        onClick={() => onShare("twitter")}
        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <Twitter className="w-4 h-4 mr-2" />
        Share on Twitter
      </button>
      <button
        onClick={() => onShare("facebook")}
        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <Facebook className="w-4 h-4 mr-2" />
        Share on Facebook
      </button>
      <button
        onClick={() => onShare("linkedin")}
        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <Linkedin className="w-4 h-4 mr-2" />
        Share on LinkedIn
      </button>
      <button
        onClick={() => onShare("copy")}
        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        Copy Link
      </button>
    </div>
  </div>
));

const BlogPreview = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const contentRef = useRef(null);
  useTitle("Blog details | LifeFlow - Blood Donation");

  // State for share options
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Track blog views
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const trackView = async () => {
            try {
              await axiosSecure.patch(`/blogs/${id}/views`);
              observer.disconnect();
            } catch (error) {
              console.error("Failed to track view:", error);
            }
          };
          trackView();
        }
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, [id, axiosSecure]);

  // Fetch blog data
  const {
    data: blog,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/blogs/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load blog");
      }
      return response.data.data;
    },
  });

  // Format date
  const formatDate = useMemo(() => {
    if (!blog) return "";
    return new Date(blog.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [blog]);

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!blog) return 1;
    return Math.ceil(blog.content.split(/\s+/).length / 200) || 1;
  }, [blog]);

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () =>
      axiosSecure.patch(`/blogs/${id}/like`, {
        authorId: blog?.authorId,
      }),
    onSuccess: (response) => {
      queryClient.setQueryData(["blog", id], (oldData) => ({
        ...oldData,
        isLiked: response.data.isLiked,
        likesCount: response.data.likesCount,
      }));
      toast[response.data.isLiked ? "success" : "info"](
        response.data.isLiked ? "Blog liked!" : "Like removed"
      );
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to like blog");
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: () =>
      axiosSecure.patch(`/blogs/${id}/bookmark`, {
        authorId: blog?.authorId,
      }),
    onSuccess: (response) => {
      queryClient.setQueryData(["blog", id], (oldData) => ({
        ...oldData,
        isBookmarked: response.data.isBookmarked,
      }));
      toast[response.data.isBookmarked ? "success" : "info"](
        response.data.isBookmarked ? "Blog bookmarked!" : "Bookmark removed"
      );
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to bookmark blog");
    },
  });

  // Handle like action
  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like this blog");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    likeMutation.mutate();
  };

  // Handle bookmark action
  const handleBookmark = () => {
    if (!user) {
      toast.error("Please login to bookmark this blog");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    bookmarkMutation.mutate();
  };

  // Handle share action
  const handleShare = async (platform) => {
    try {
      const url = window.location.href;
      const title = blog.title;
      const text = blog.excerpt || `Check out this blog: ${blog.title}`;

      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              url
            )}&text=${encodeURIComponent(text)}`,
            "_blank"
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "copy":
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title,
              text,
              url,
            });
          }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    } finally {
      setShowShareOptions(false);
    }
  };

  // Close share options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareOptions && !event.target.closest(".share-container")) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareOptions]);

  // Loading state
  if (isLoading) return <LoadingSpinner fullScreen />;

  // Error state
  if (error)
    return (
      <ErrorMessage
        message={error.message}
        onRetry={refetch}
        onNavigate={() => navigate("/blogs")}
      />
    );

  // Blog not found
  if (!blog)
    return (
      <div className="px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
          Blog not found
        </h2>
        <button
          onClick={() => navigate("/blogs")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          Browse All Blogs
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Blogs
      </motion.button>

      {/* Blog Header Section */}
      <header className="mb-8">
        {/* Category/Tag */}
        {blog.category && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4"
          >
            {blog.category}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight"
        >
          {blog.title}
        </motion.h1>

        {/* Meta Information */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
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
        </motion.div>

        {/* Author Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 mb-8"
        >
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
        </motion.div>
      </header>

      {/* Featured Image */}
      {blog.thumbnail && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 rounded-xl overflow-hidden shadow-lg"
        >
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
        </motion.div>
      )}

      {/* Blog Content */}
      <motion.article
        ref={contentRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="prose dark:prose-invert prose-lg max-w-none mb-12"
      >
        {blog.excerpt && (
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-6">
            {blog.excerpt}
          </p>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blog.content),
          }}
        />
      </motion.article>

      {/* Tags Section */}
      {blog.tags?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Tags:
          </h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blogs?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-t border-b border-gray-200 dark:border-gray-700 py-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            aria-label={blog.isLiked ? "Unlike blog" : "Like blog"}
            className={`flex items-center space-x-1 transition-colors ${
              blog.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
            disabled={likeMutation.isPending}
          >
            <Heart
              className="w-5 h-5"
              fill={blog.isLiked ? "currentColor" : "none"}
            />
            <span>{blog.likesCount || blog.likes?.length || 0}</span>
          </button>
          <button
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            aria-label="View comments"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{blog.comments?.length || 0}</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleBookmark}
            aria-label={blog.isBookmarked ? "Remove bookmark" : "Bookmark blog"}
            className={`transition-colors ${
              blog.isBookmarked
                ? "text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            }`}
            disabled={bookmarkMutation.isPending}
          >
            <Bookmark
              className="w-5 h-5"
              fill={blog.isBookmarked ? "currentColor" : "none"}
            />
          </button>
          <div className="relative share-container">
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="text-gray-500 hover:text-blue-500 transition-colors"
              aria-label="Share blog"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {showShareOptions && (
              <ShareOptions
                onShare={handleShare}
                onClose={() => setShowShareOptions(false)}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Author Bio Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-12"
      >
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
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {blog.authorSocial.linkedin && (
                  <a
                    href={blog.authorSocial.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <BlogComment
          authorId={blog.authorId}
          blogId={id}
          comments={blog.comments || []}
        />
      </motion.div>
    </div>
  );
};

export default BlogPreview;
