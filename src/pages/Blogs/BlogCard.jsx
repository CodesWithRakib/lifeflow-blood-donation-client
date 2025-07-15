import { Link } from "react-router";
import { FaRegCalendarAlt, FaRegEye, FaRegClock } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const BlogCard = ({ blog }) => {
  // Strip HTML tags from content
  const plainTextContent = blog.content?.replace(/<[^>]*>/g, "") || "";

  // Calculate reading time (assuming 200 words per minute)
  const wordCount = plainTextContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link to={`/blogs/${blog.slug || blog._id}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={blog.thumbnail || blog.image || "/default-blog.jpg"}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
            loading="lazy"
          />
          {blog.status === "draft" && (
            <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Draft
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <FiUser size={12} />
            {blog.author}
          </span>
          <span className="flex items-center gap-1">
            <FaRegCalendarAlt size={10} />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
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

        <Link to={`/blogs/${blog.slug || blog._id}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-amber-500 transition">
            {blog.title}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {blog.summary || plainTextContent.substring(0, 150) + "..."}
        </p>

        <Link
          to={`/blogs/${blog._id || blog.slug}`}
          className="inline-flex items-center text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium transition"
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
      </div>
    </article>
  );
};

export default BlogCard;
