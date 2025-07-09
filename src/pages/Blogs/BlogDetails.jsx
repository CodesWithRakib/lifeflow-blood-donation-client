import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxios from "../../hooks/useAxios";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();

  const axiosSecure = useAxios();

  console.log(blog);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosSecure.get(`/api/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [axiosSecure, id]);
  if (!blog) {
    return <div className="text-center py-20">Blog not found</div>;
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <img
        src={blog.image}
        alt={blog.title}
        className="rounded-xl w-full mb-6"
      />
      <h1 className="text-3xl font-bold text-amber-600">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By {blog.author} • {blog.date}
      </p>
      <p className="text-gray-800 leading-7 whitespace-pre-line">
        {blog.content}
      </p>
    </div>
  );
};

export default BlogDetails;
