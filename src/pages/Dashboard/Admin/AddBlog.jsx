// AddBlog.jsx
import {
  BookPlus,
  Edit,
  EyeOff,
  Save,
  Trash2,
  Upload,
  Plus,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import JoditEditor from "jodit-react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import uploadImageToImageBB from "../../../utils/imageUpload";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import useAxios from "../../../hooks/useAxios";

const AddBlog = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [contentValidationError, setContentValidationError] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      statusFilter === "all"
        ? ["draft", "published"].includes(blog.status)
        : blog.status === statusFilter
    );
  }, [blogs, statusFilter]);

  const initialize = useCallback(async () => {
    try {
      const [adminCheck, blogsResponse] = await Promise.all([
        axiosSecure.get("/user/check-admin"),
        axiosSecure.get("/blogs?status=all"),
      ]);
      setIsAdmin(adminCheck.data.isAdmin);
      setBlogs(blogsResponse.data.data || []);
    } catch (error) {
      toast.error("Failed to load blogs");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    initialize();
    const timer = setTimeout(() => setIsEditorReady(true), 300);
    return () => clearTimeout(timer);
  }, [initialize]);

  const isContentEmpty = (content) => {
    if (!content) return true;
    const stripped = content.replace(/<[^>]*>/g, "").trim();
    return stripped.length < 100;
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match("image.*")) {
      toast.error("Only images (jpeg, png, webp) allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width < 600 || img.height < 315) {
        toast.error("Image must be at least 600x315");
      } else {
        setSelectedImage(file);
        setPreviewImage(img.src);
      }
    };
  };

  const onSubmit = async (data) => {
    if (!selectedImage) {
      toast.error("Please upload a thumbnail image");
      return;
    }
    if (isContentEmpty(data.content)) {
      toast.error("Blog content must be at least 100 characters");
      setContentValidationError(true);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating blog...");
    try {
      const imageUrl = await uploadImageToImageBB(selectedImage);
      const slug = data.title
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-");

      const newBlog = {
        title: data.title.trim(),
        slug,
        content: data.content,
        thumbnail: imageUrl,
        authorId: user.uid,
        authorImage: user.photoURL,
      };

      const res = await axiosSecure.post("/blogs", newBlog);
      if (res.data.success) {
        toast.success("Blog created successfully", { id: toastId });
        reset();
        setSelectedImage(null);
        setPreviewImage("");
        setBlogs([res.data.data, ...blogs]);
        setActiveTab("manage");
      } else {
        throw new Error(res.data.message || "Unknown error");
      }
    } catch (err) {
      toast.error(err.message || "Blog creation failed", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!isAdmin) {
      toast.error("Not authorized");
      return;
    }

    const confirm = await Swal.fire({
      title: "Change blog status?",
      text: `Change to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/blogs/${id}/status`, {
          status: newStatus,
        });
        if (res.data.success) {
          setBlogs((prev) =>
            prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
          );
          toast.success("Status updated");
        }
      } catch (err) {
        toast.error("Failed to update status");
      }
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!isAdmin) return toast.error("Not authorized");
    const confirm = await Swal.fire({
      title: "Delete blog?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/blogs/${id}`);
        if (res.data.success) {
          setBlogs(blogs.filter((b) => b._id !== id));
          toast.success("Blog deleted");
        }
      } catch (err) {
        toast.error("Failed to delete blog");
      }
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Blog Management
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create and manage your blog content
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("create")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "create"
                ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Plus className="w-4 h-4" />
            Create New Blog
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "manage"
                ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Manage Blogs
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "create" ? (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <BookPlus className="w-5 h-5" />
            New Blog Post
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 10,
                    message: "Title must be at least 10 characters",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Thumbnail Image <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                      JPEG, PNG or WEBP (600x315 min)
                    </p>
                  </div>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={onImageChange}
                  />
                </label>
                {previewImage && (
                  <div className="relative group">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-32 w-32 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      onClick={() => {
                        setSelectedImage(null);
                        setPreviewImage("");
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Blog Content <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <Controller
                  control={control}
                  name="content"
                  rules={{ validate: (val) => !isContentEmpty(val) }}
                  render={({ field }) => (
                    <JoditEditor
                      ref={editor}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(val) => {
                        setContentValidationError(false);
                        field.onChange(val);
                      }}
                      config={{
                        height: 400,
                        theme: "dark",
                        toolbarAdaptive: false,
                        buttons: [
                          "bold",
                          "italic",
                          "underline",
                          "strikethrough",
                          "|",
                          "ul",
                          "ol",
                          "|",
                          "font",
                          "fontsize",
                          "brush",
                          "paragraph",
                          "|",
                          "align",
                          "outdent",
                          "indent",
                          "|",
                          "image",
                          "video",
                          "table",
                          "link",
                          "|",
                          "undo",
                          "redo",
                          "|",
                          "source",
                        ],
                      }}
                    />
                  )}
                />
              </div>
              {(contentValidationError || errors.content) && (
                <p className="mt-1 text-sm text-red-600">
                  Content must be at least 100 characters
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedImage(null);
                  setPreviewImage("");
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 disabled:opacity-70 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Creating..." : "Create Blog"}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Blog Posts
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full sm:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <button
                onClick={() => setActiveTab("create")}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                New Post
              </button>
            </div>
          </div>

          {filteredBlogs.length === 0 ? (
            <EmptyState
              title="No Blogs Found"
              description="Create your first blog post to get started"
              actionText="Create New Blog"
              onAction={() => setActiveTab("create")}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="h-full w-full object-cover"
                    />
                    <span
                      className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {blog.content.replace(/<[^>]*>/g, "").slice(0, 120)}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>{blog.views} views</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/content-management/edit-blog/${blog._id}`
                          )
                        }
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <div className="flex gap-3">
                        {blog.status === "draft" ? (
                          <button
                            disabled={!isAdmin}
                            onClick={() =>
                              handleStatusChange(blog._id, "published")
                            }
                            className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                          >
                            <BookPlus className="w-3 h-3" /> Publish
                          </button>
                        ) : (
                          <button
                            disabled={!isAdmin}
                            onClick={() =>
                              handleStatusChange(blog._id, "draft")
                            }
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                          >
                            <EyeOff className="w-3 h-3" /> Unpublish
                          </button>
                        )}
                        <button
                          disabled={!isAdmin}
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default AddBlog;
