import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import {
  Bookmark,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";
import BlogComment from "../../components/Blogs/BlogComment";

const BlogPreview = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/api/blogs/${id}`);

        // Track view count
        await axiosSecure.patch(`/api/blogs/${id}/views`);

        setBlog(response.data);
        setViewCount(response.data.views || 0);
        setError(null);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [axiosSecure, id]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like this blog");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosSecure.patch(`/api/blogs/${id}/like`);
      setIsLiked(!isLiked);
      toast.success(isLiked ? "Removed like" : "Blog liked!");
    } catch (error) {
      toast.error("Failed to like blog");
      console.error("Like error:", error);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark this blog");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosSecure.patch(`/api/blogs/${id}/bookmark`);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Removed bookmark" : "Blog bookmarked!");
    } catch (error) {
      toast.error("Failed to bookmark blog");
      console.error("Bookmark error:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: `Check out this blog: ${blog.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
          Blog not found
        </h2>
        <button
          onClick={() => navigate("/blogs")}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
        >
          Browse All Blogs
        </button>
      </div>
    );
  }

  const formatDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const readingTime = Math.ceil(blog.content.split(" ").length / 200); // 200 words per minute

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        <ol className="flex space-x-2">
          <li>
            <button onClick={() => navigate("/")} className="hover:underline">
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => navigate("/blogs")}
              className="hover:underline"
            >
              Blogs
            </button>
          </li>
          <li>/</li>
          <li className="text-amber-600">{blog.title}</li>
        </ol>
      </nav>

      {/* Blog Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {blog.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Eye className="w-4 h-4" />
              <span>{viewCount} views</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Published: {formatDate}
            </span>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <img
              src={blog.authorImage || "/default-avatar.png"}
              alt={blog.author}
              className="w-full h-full object-cover"
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
      <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-auto max-h-[500px] object-cover"
          loading="lazy"
        />
      </div>

      {/* Blog Content */}
      <article className="prose dark:prose-invert max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>

      {/* Tags Section */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Tags:
          </h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 border-t border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart
              className="w-5 h-5"
              fill={isLiked ? "currentColor" : "none"}
            />
            <span>{blog.likes?.length || 0}</span>
          </button>

          <button className="flex items-center space-x-1 text-gray-500 hover:text-amber-500">
            <MessageSquare className="w-5 h-5" />
            <span>{blog.comments?.length || 0}</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleBookmark}
            className={`${
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
            className="text-gray-500 hover:text-amber-500"
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
              <div className="flex space-x-4">
                {blog.authorSocial.twitter && (
                  <a
                    href={blog.authorSocial.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-amber-500"
                  >
                    Twitter
                  </a>
                )}
                {blog.authorSocial.linkedin && (
                  <a
                    href={blog.authorSocial.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-amber-500"
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

      {/* Related Blogs Section */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          You Might Also Like
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for related blogs - you would fetch these from your API */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Related Blog Title
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              Brief excerpt from the related blog post...
            </p>
          </div>
          {/* Add more related blogs as needed */}
        </div>
      </section>
    </div>
  );
};

export default BlogPreview;
