import { BookPlus, Edit, EyeOff, Save, Trash2, Upload } from "lucide-react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import JoditEditor from "jodit-react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import uploadImageToImageBB from "../../utils/imageUpload";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import useAxios from "../../hooks/useAxios";

const AddBlog = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State management
  const [blogs, setBlogs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [contentValidationError, setContentValidationError] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Memoized filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      statusFilter === "all" ? true : blog.status === statusFilter
    );
  }, [blogs, statusFilter]);
  console.log(isAdmin);
  // Initialize component
  const initialize = useCallback(async () => {
    try {
      // Check if current user is admin
      const [adminCheck, blogsResponse] = await Promise.all([
        axiosSecure.get("/api/user/check-admin"),
        axiosSecure.get("/api/blogs"),
      ]);

      setIsAdmin(adminCheck.data.isAdmin);
      setBlogs(blogsResponse.data.data || []);
      console.log(blogsResponse.data.data);
    } catch (error) {
      toast.error("Failed to initialize blog data");
      console.error("Initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    initialize();
    // Initialize editor after component mounts
    const timer = setTimeout(() => {
      setIsEditorReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [initialize]);

  // Handle image selection with validation
  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (JPEG, PNG, or WEBP)");
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Validate dimensions (client-side check)
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width < 600 || img.height < 315) {
        toast.error("Recommended minimum dimensions: 600x315 pixels");
      } else {
        setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    };
  };

  // Check if content is empty (more robust)
  const isContentEmpty = (content) => {
    if (!content) return true;
    const stripped = content.replace(/<[^>]*>/g, "").trim();
    return stripped === "" || stripped === "\n";
  };

  // Submit form with validation and API call
  const onSubmit = async (data) => {
    if (!selectedImage) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    if (isContentEmpty(data.content)) {
      setContentValidationError(true);
      toast.error("Please add meaningful blog content");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating blog...");

    try {
      // ✅ Upload thumbnail to ImageBB
      const imageUrl = await uploadImageToImageBB(selectedImage);

      // ✅ Generate slug
      const slug = data.title
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");

      // ✅ Prepare blog data matching server requirements
      const newBlog = {
        title: data.title.trim(),
        slug,
        content: data.content,
        thumbnail: imageUrl,
        authorId: user.uid, // ✅ firebaseUid
        authorImage: user.photoURL,
      };

      // ✅ POST to your backend
      const response = await axiosSecure.post("/api/blogs", newBlog);

      if (response.data.success) {
        toast.success("Blog created successfully", { id: toastId });
        reset();
        setSelectedImage(null);
        setPreviewImage("");
        setBlogs([response.data.data, ...blogs]);
      } else {
        throw new Error(response.data.message || "Unknown error");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create blog";
      toast.error(errorMessage, { id: toastId });
      console.error("Blog creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Change blog status (admin only)
  const handleStatusChange = async (id, newStatus) => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Status Change",
      text: `Are you sure you want to change this blog's status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.patch(`/api/blogs/${id}/status`, {
          status: newStatus,
        });

        if (response.data.success) {
          setBlogs(
            blogs.map((blog) =>
              blog._id === id ? { ...blog, status: newStatus } : blog
            )
          );
          toast.success(
            `Blog status updated to ${
              newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
            }`
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to update status. Please try again."
        );
        console.error("Status update error:", error);
      }
    }
  };

  // Delete blog (admin only)
  const handleDeleteBlog = async (id) => {
    if (!isAdmin) {
      toast.error("You don't have permission to delete blogs");
      return;
    }

    const result = await Swal.fire({
      title: "Delete Blog Post",
      text: "This action cannot be undone. All associated data will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete Permanently",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/api/blogs/${id}`);
        if (response.data.success) {
          setBlogs(blogs.filter((blog) => blog._id !== id));
          toast.success("Blog deleted successfully");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to delete blog. Please try again."
        );
        console.error("Delete error:", error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Blog Creation Section */}
        <section className="p-6 border-b dark:border-gray-700">
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Create New Blog Post
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Fill in the details below to create a new blog article
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title Field */}
            <div className="mb-6">
              <label
                htmlFor="blog-title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Blog Title *
              </label>
              <input
                id="blog-title"
                type="text"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 10,
                    message: "Title should be at least 10 characters",
                  },
                  maxLength: {
                    value: 120,
                    message: "Title should not exceed 120 characters",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter a descriptive title for your blog"
                aria-invalid={errors.title ? "true" : "false"}
                aria-describedby="title-error"
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail Image *
              </label>
              <div className="flex items-center gap-4">
                <label
                  className={`flex flex-col items-center justify-center px-4 py-3 rounded-md border-2 border-dashed cursor-pointer transition-colors ${
                    previewImage
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-amber-500"
                  }`}
                  tabIndex="0"
                  aria-label="Upload thumbnail image"
                >
                  <Upload
                    className={`w-5 h-5 ${
                      previewImage ? "text-amber-600" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`mt-1 text-sm ${
                      previewImage
                        ? "text-amber-600 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {previewImage ? "Change Image" : "Upload Image"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={onImageChange}
                    disabled={isSubmitting}
                  />
                </label>
                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setPreviewImage("");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Recommended size: 1200x630 pixels (max 5MB)
              </p>
            </div>

            {/* Content Editor */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog Content *
              </label>
              <Controller
                name="content"
                control={control}
                rules={{
                  validate: (value) => !isContentEmpty(value),
                }}
                render={({ field }) => (
                  <div
                    className={`border rounded-md overflow-hidden ${
                      contentValidationError || errors.content
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {isEditorReady && (
                      <JoditEditor
                        ref={editor}
                        value={field.value}
                        onChange={(content) => {
                          field.onChange(content);
                          setContentValidationError(false);
                        }}
                        onBlur={(newContent) => field.onChange(newContent)}
                        config={{
                          placeholder: "Write your compelling content here...",
                          buttons: [
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                            "link",
                            "ul",
                            "ol",
                            "outdent",
                            "indent",
                            "font",
                            "fontsize",
                            "paragraph",
                            "image",
                            "table",
                            "align",
                            "undo",
                            "redo",
                            "fullsize",
                          ],
                          height: 400,
                          toolbarAdaptive: false,
                          disablePlugins: "paste,tab",
                          zIndex: 0,
                          iframe: false,
                          readonly: false,
                          style: {
                            fontFamily:
                              "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                          },
                          events: {
                            afterInit: (instance) => {
                              // Safely call focus on the instance, not on editor.current
                              setTimeout(() => {
                                try {
                                  instance?.focus();
                                } catch (err) {
                                  console.warn("Editor focus failed:", err);
                                }
                              }, 100);
                            },
                          },
                        }}
                        tabIndex={1}
                      />
                    )}
                  </div>
                )}
              />
              {(contentValidationError || errors.content) && (
                <p className="mt-1 text-sm text-red-600">
                  Please provide meaningful blog content (at least 100
                  characters)
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedImage(null);
                  setPreviewImage("");
                }}
                disabled={!isDirty && !previewImage}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !selectedImage ||
                  !isDirty ||
                  !watch("title") ||
                  isContentEmpty(watch("content"))
                }
                className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="mr-2 w-4 h-4" />
                {isSubmitting ? "Creating..." : "Create Blog"}
              </button>
            </div>
          </form>
        </section>

        {/* Blog Management Section */}
        <section className="p-6">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Blog Management
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {blogs.length} total blog posts • {filteredBlogs.length}{" "}
                filtered
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="status-filter"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by:
              </label>
              <select
                id="status-filter"
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter blogs by status"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Drafts</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </header>

          {filteredBlogs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-sm line-clamp-2">
                        {blog.content
                          ?.replace(/<[^>]*>/g, "")
                          .substring(0, 100) || "No content"}
                        {blog.content?.length > 100 ? "..." : ""}
                      </p>
                    </div>
                    <span
                      className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold capitalize rounded-full ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : blog.status === "draft"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>{blog.views} views</span>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3">
                      <button
                        onClick={() => navigate(`/admin/edit-blog/${blog._id}`)}
                        className="text-amber-600 hover:text-amber-800 dark:hover:text-amber-400 flex items-center text-sm font-medium transition-colors"
                        aria-label={`Edit ${blog.title}`}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>

                      <div className="flex gap-3">
                        {blog.status === "draft" ? (
                          <button
                            onClick={() =>
                              handleStatusChange(blog._id, "published")
                            }
                            className={`text-green-600 hover:text-green-800 dark:hover:text-green-400 flex items-center text-sm font-medium transition-colors ${
                              !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={!isAdmin}
                            aria-label={`Publish ${blog.title}`}
                          >
                            <BookPlus className="w-4 h-4 mr-1" />
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleStatusChange(blog._id, "draft")
                            }
                            className={`text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 flex items-center text-sm font-medium transition-colors ${
                              !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={!isAdmin}
                            aria-label={`Unpublish ${blog.title}`}
                          >
                            <EyeOff className="w-4 h-4 mr-1" />
                            Unpublish
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className={`text-red-600 hover:text-red-800 dark:hover:text-red-400 flex items-center text-sm font-medium transition-colors ${
                            !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={!isAdmin}
                          aria-label={`Delete ${blog.title}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No blogs found"
              description={`No blogs match the ${statusFilter} filter`}
              icon={<BookPlus className="w-12 h-12 text-gray-400 mx-auto" />}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default AddBlog;
