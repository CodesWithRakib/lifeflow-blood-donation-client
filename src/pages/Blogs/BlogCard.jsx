import React, { useMemo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  FaRegCalendarAlt,
  FaRegEye,
  FaRegClock,
  FaRegBookmark,
  FaRegCommentAlt,
  FaHeart,
  FaUser,
  FaTag,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const BlogCard = ({ blog }) => {
  // Strip HTML tags from content
  const plainTextContent = useMemo(
    () => blog.content?.replace(/<[^>]*>/g, "") || "",
    [blog.content]
  );

  // Calculate reading time (assuming 200 words per minute)
  const readingTime = useMemo(() => {
    const wordCount = plainTextContent.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  }, [plainTextContent]);

  // Format date
  const formattedDate = useMemo(() => {
    return new Date(blog.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [blog.createdAt]);

  // Get category color
  const getCategoryColor = (category) => {
    if (!category)
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

    const colors = {
      Donation: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      Health:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Events:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Stories:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Education:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    };

    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
    >
      {/* Image Container - Responsive aspect ratio */}
      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
        <Link
          to={`/blogs/${blog.slug || blog._id}`}
          aria-label={`Read ${blog.title}`}
        >
          <motion.img
            src={blog.thumbnail || blog.image || "/default-blog.jpg"}
            alt={blog.title}
            className="w-full h-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </Link>

        {/* Status Badge */}
        {blog.status === "draft" && (
          <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            Draft
          </span>
        )}

        {/* Category Badge */}
        {blog.category && (
          <span
            className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full ${getCategoryColor(
              blog.category
            )}`}
          >
            {blog.category}
          </span>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content - Flexible area that grows with content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Meta Information */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <FiUser size={12} />
            <span className="truncate max-w-[100px] sm:max-w-none">
              {blog.author || "Anonymous"}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <FaRegCalendarAlt size={10} />
            <span className="truncate">{formattedDate}</span>
          </span>
          <span className="flex items-center gap-1">
            <FaRegClock size={10} />
            {readingTime} min read
          </span>
          {blog.views > 0 && (
            <span className="flex items-center gap-1">
              <FaRegEye size={10} />
              {blog.views} views
            </span>
          )}
        </div>

        {/* Title - Responsive text sizing */}
        <Link to={`/blogs/${blog.slug || blog._id}`}>
          <motion.h3
            className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-500 transition-colors"
            whileHover={{ x: 5 }}
          >
            {blog.title}
          </motion.h3>
        </Link>

        {/* Summary/Content Preview - Responsive line clamping */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 sm:line-clamp-3 flex-grow">
          {blog.summary || plainTextContent.substring(0, 150) + "..."}
        </p>

        {/* Tags - Responsive layout */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
              >
                <FaTag size={10} className="mr-1" />
                <span className="truncate max-w-[60px] sm:max-w-none">
                  {tag}
                </span>
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                +{blog.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons - Always at bottom */}
        <div className="mt-auto pt-2">
          <div className="flex justify-between items-center">
            <Link
              to={`/blogs/${blog._id || blog.slug}`}
              className="inline-flex items-center text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium transition-colors"
              aria-label={`Read more about ${blog.title}`}
            >
              Read more
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>

            {/* Interaction buttons */}
            <div className="flex gap-2">
              <button
                className="p-1.5 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label="Like this article"
              >
                <FaHeart size={14} />
              </button>
              <button
                className="p-1.5 rounded-full text-gray-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                aria-label="Save this article"
              >
                <FaRegBookmark size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
