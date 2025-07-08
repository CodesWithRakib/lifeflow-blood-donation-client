// src/pages/Blogs.jsx
import { useState } from "react";
import BlogCard from "../../components/Blogs/BlogCard";

const Blogs = () => {
  const [search, setSearch] = useState("");
  const blogs = [
    {
      id: "1",
      title: "Why Blood Donation is Important",
      summary:
        "Discover the vital role blood donors play in saving lives around the world.",
      content: "Full content of blog 1...",
      image: "https://source.unsplash.com/600x400/?blood",
      author: "Rakib Islam",
      date: "2025-07-08",
    },
    {
      id: "2",
      title: "How to Prepare for Blood Donation",
      summary:
        "Tips to help you get ready and feel comfortable before donating blood.",
      content: "Full content of blog 2...",
      image: "https://source.unsplash.com/600x400/?donation",
      author: "Jane Doe",
      date: "2025-07-06",
    },
  ];

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-600 mb-6">Blog Articles</h1>

      <input
        type="text"
        placeholder="Search blogs..."
        className="w-full mb-6 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.length ? (
          filteredBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        ) : (
          <p className="text-gray-500 col-span-full">No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default Blogs;
