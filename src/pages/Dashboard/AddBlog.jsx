import { BookPlus, Edit, EyeOff, Save, Trash2, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import JoditEditor from "jodit-react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import uploadImageToImageBB from "../../utils/imageUpload";

const AddBlog = () => {
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const editor = useRef(null);
  const isAdmin = true;

  // Sample blog data
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Blood Donation Benefits",
      thumbnail: "https://i.ibb.co/0jQ2ZzN/blood-donation.jpg",
      content: "<p>Learn about blood donation benefits...</p>",
      status: "published",
      createdAt: "2023-05-15",
    },
  ]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      title: "",
      content: "", // Ensure content has default value
    },
  });

  // Handle image selection
  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Submit form
  const onSubmit = async (data) => {
    if (!selectedImage) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    if (!data.content || data.content === "<p><br></p>") {
      toast.error("Please add blog content");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Creating blog...");
    console.log(data);

    try {
      // Upload image first
      const imageUrl = await uploadImageToImageBB(selectedImage);

      // Submit blog data
      const newBlog = {
        title: data.title.trim(),
        thumbnail: imageUrl,
        content: data.content,
        status: "draft",
        createdAt: new Date().toISOString(),
      };

      const response = await axiosSecure.post("api/blogs", newBlog);
      console.log(response);

      if (response.data.success) {
        toast.success("Blog created successfully");
        reset();
        setSelectedImage(null);
        setPreviewImage("");
        setBlogs([response.data.data, ...blogs]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
      console.error("Blog creation error:", error);
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  };

  // Change blog status
  const handleStatusChange = async (id, newStatus) => {
    if (!isAdmin) {
      toast.error("Only admin can change status");
      return;
    }

    try {
      const response = await axiosSecure.patch(`/blogs/${id}/status`, {
        status: newStatus,
      });

      if (response.data.success) {
        setBlogs(
          blogs.map((blog) =>
            blog.id === id ? { ...blog, status: newStatus } : blog
          )
        );
        toast.success(`Blog status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (id) => {
    if (!isAdmin) {
      toast.error("Only admin can delete blogs");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/blogs/${id}`);
        if (response.data.success) {
          setBlogs(blogs.filter((blog) => blog.id !== id));
          toast.success("Blog deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete blog");
        console.error(error);
      }
    }
  };

  // Filter blogs by status
  const filteredBlogs =
    statusFilter === "all"
      ? blogs
      : blogs.filter((blog) => blog.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {/* Blog Creation Form */}
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Create New Blog
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                {...register("title", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter blog title"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail Image *
              </label>
              <div className="flex items-center">
                <label className="flex flex-col items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Upload className="w-5 h-5 text-amber-600" />
                  <span className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {previewImage ? "Change Image" : "Upload Image"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onImageChange}
                    disabled={isSubmitting}
                  />
                </label>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded-md ml-4"
                  />
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog Content *
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <JoditEditor
                    ref={editor}
                    value={field.value}
                    onChange={(content) => {
                      // Update form value and prevent empty content
                      if (content !== "<p><br></p>") {
                        field.onChange(content);
                      } else {
                        field.onChange("");
                      }
                    }}
                    config={{
                      placeholder: "Write your blog content here...",
                      buttons: [
                        "bold",
                        "italic",
                        "underline",
                        "link",
                        "ul",
                        "ol",
                        "align",
                        "undo",
                        "redo",
                      ],
                    }}
                  />
                )}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !selectedImage || !isDirty}
                className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md disabled:opacity-50"
              >
                <Save className="mr-2" />
                {isSubmitting ? "Creating..." : "Create Blog"}
              </button>
            </div>
          </form>
        </div>

        {/* Blog List Section */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              All Blogs
            </h2>

            <div className="flex items-center">
              <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter:
              </label>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-amber-500 focus:border-amber-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Created: {new Date(blog.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => navigate(`/admin/edit-blog/${blog.id}`)}
                        className="text-amber-600 hover:text-amber-800 dark:hover:text-amber-400 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        <span className="text-xs">Edit</span>
                      </button>

                      <div className="flex space-x-2">
                        {blog.status === "draft" ? (
                          <button
                            onClick={() =>
                              handleStatusChange(blog.id, "published")
                            }
                            className={`text-green-600 hover:text-green-800 dark:hover:text-green-400 flex items-center ${
                              !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={!isAdmin}
                          >
                            <BookPlus className="w-4 h-4 mr-1" />
                            <span className="text-xs">Publish</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(blog.id, "draft")}
                            className={`text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 flex items-center ${
                              !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={!isAdmin}
                          >
                            <EyeOff className="w-4 h-4 mr-1" />
                            <span className="text-xs">Unpublish</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className={`text-red-600 hover:text-red-800 dark:hover:text-red-400 flex items-center ${
                            !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={!isAdmin}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="text-xs">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No blogs found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
