// src/components/BlogCard.jsx
import { Link } from "react-router";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition duration-300">
      <img
        src={blog.image}
        alt={blog.title}
        className="rounded-xl h-48 w-full object-cover mb-4"
      />
      <h2 className="text-xl font-semibold text-amber-600">{blog.title}</h2>
      <p className="text-gray-600 text-sm mt-1">{blog.summary}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">{blog.author}</span>
        <Link
          to={`/blogs/${blog.id}`}
          className="text-amber-500 hover:underline text-sm"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
