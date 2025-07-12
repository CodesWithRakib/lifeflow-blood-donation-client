import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Bookmark,
  Edit,
  Eye,
  Save,
  Trash2,
  Upload,
  ChevronLeft,
} from "lucide-react";
import JoditEditor from "jodit-react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import uploadImageToImageBB from "../../utils/imageUpload";
import LoadingSpinner from "../../components/LoadingSpinner";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const editor = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty, errors },
    watch,
  } = useForm();

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  // Check if content is empty (more robust)
  const isContentEmpty = useCallback((content) => {
    if (!content) return true;
    const stripped = content.replace(/<[^>]*>/g, "").trim();
    return stripped === "" || stripped === "\n";
  }, []);

  // Fetch blog data and check admin status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check admin status and fetch blog data in parallel
        const [adminCheck, blogResponse] = await Promise.all([
          axiosSecure.get("/api/user/check-admin"),
          axiosSecure.get(`/api/blogs/${id}`),
        ]);

        setIsAdmin(adminCheck.data.isAdmin);

        if (!blogResponse.data.success) {
          throw new Error("Blog not found");
        }

        setBlog(blogResponse.data.data);
        reset({
          title: blogResponse.data.data.title,
          content: blogResponse.data.data.content,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Failed to load blog");
        navigate("/blogs", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, axiosSecure, reset, navigate]);

  // Handle image selection with improved validation
  const onImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image/(png|jpeg|webp)")) {
      toast.error("Please select a valid image file (JPEG, PNG, or WEBP)");
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
        setPreviewImage(img.src);
      }
    };
    img.onerror = () => {
      toast.error("Failed to load image. Please try another file.");
    };
  }, []);

  // Submit updated blog
  const onSubmit = useCallback(
    async (data) => {
      if (isContentEmpty(data.content)) {
        toast.error("Please add meaningful blog content");
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading("Updating blog...");

      try {
        let imageUrl = blog.thumbnail;

        // Upload new image if selected
        if (selectedImage) {
          imageUrl = await uploadImageToImageBB(selectedImage);
        }

        const updatedBlog = {
          title: data.title.trim(),
          content: data.content,
          thumbnail: imageUrl,
          updatedAt: new Date().toISOString(),
        };

        const response = await axiosSecure.put(`/api/blogs/${id}`, updatedBlog);

        if (response.data.success) {
          toast.success("Blog updated successfully", { id: toastId });
          navigate(`/blogs/${id}`);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to update blog";
        toast.error(errorMessage, { id: toastId });
        console.error("Blog update error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [blog, selectedImage, axiosSecure, id, navigate, isContentEmpty]
  );

  // Delete blog with confirmation
  const handleDelete = useCallback(async () => {
    if (!isAdmin) {
      toast.error("Only admin can delete blogs");
      return;
    }

    const result = await Swal.fire({
      title: "Delete Blog Post?",
      text: "This action cannot be undone. All comments and associated data will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete Permanently",
      background: "#ffffff",
      customClass: {
        popup: "dark:bg-gray-800 dark:text-white",
        title: "dark:text-white",
        content: "dark:text-gray-300",
        confirmButton: "hover:bg-red-700 transition-colors",
        cancelButton: "hover:bg-gray-600 transition-colors",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/api/blogs/${id}`);
        if (response.data.success) {
          toast.success("Blog deleted successfully");
          navigate("/blogs", { replace: true });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete blog";
        toast.error(errorMessage);
        console.error("Delete error:", error);
      }
    }
  }, [isAdmin, axiosSecure, id, navigate]);

  // Change blog status
  const handleStatusChange = useCallback(
    async (newStatus) => {
      if (!isAdmin) {
        toast.error("Only admin can change status");
        return;
      }

      try {
        const response = await axiosSecure.patch(`/api/blogs/${id}/status`, {
          status: newStatus,
        });

        if (response.data.success) {
          setBlog((prev) => ({ ...prev, status: newStatus }));
          toast.success(`Blog status updated to ${newStatus}`);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to update status";
        toast.error(errorMessage);
        console.error("Status update error:", error);
      }
    },
    [isAdmin, axiosSecure, id]
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
          Blog not found
        </h2>
        <button
          onClick={() => navigate("/blogs")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse All Blogs
        </button>
      </div>
    );
  }

  // Check if current user is the author or admin
  const isAuthor = user?.uid === blog.authorId;
  const canEdit = isAdmin || isAuthor;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Edit Blog Post
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                navigate(`/dashboard/content-management/blog-preview/${id}`)
              }
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              aria-label="Preview blog"
            >
              <Eye className="mr-2 w-4 h-4" />
              Preview
            </button>

            {canEdit && (
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                aria-label="Delete blog"
                disabled={isSubmitting}
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Badge and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              blog.status === "published"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : blog.status === "draft"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {blog.views} views
          </span>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            {blog.status === "draft" ? (
              <button
                onClick={() => handleStatusChange("published")}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                aria-label="Publish blog"
                disabled={isSubmitting}
              >
                <Bookmark className="w-3 h-3" />
                Publish
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange("draft")}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                aria-label="Unpublish blog"
                disabled={isSubmitting}
              >
                <Bookmark className="w-3 h-3" />
                Unpublish
              </button>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <div>
          <label
            htmlFor="blog-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Title <span className="text-red-500">*</span>
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
            className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={!canEdit || isSubmitting}
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby="title-error"
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-600">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Thumbnail Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Thumbnail Image
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              ) : (
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  loading="lazy"
                />
              )}
              {canEdit && previewImage && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewImage("");
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                  aria-label="Remove image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {canEdit && (
              <div className="flex-1">
                <label
                  className={`inline-flex flex-col items-center px-4 py-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors w-full ${
                    previewImage
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                  }`}
                  aria-label="Upload thumbnail image"
                >
                  <div className="flex flex-col items-center">
                    <Upload
                      className={`w-6 h-6 mb-2 ${
                        previewImage ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        previewImage
                          ? "text-blue-600 font-medium"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {previewImage ? "Change Image" : "Upload New Image"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      JPEG, PNG or WEBP (5MB max)
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={onImageChange}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Recommended size: 1200x630 pixels (16:9 aspect ratio)
          </p>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <Controller
            name="content"
            control={control}
            rules={{ validate: (value) => !isContentEmpty(value) }}
            render={({ field }) => (
              <div
                className={`rounded-md overflow-hidden ${
                  errors.content
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <JoditEditor
                  ref={editor}
                  value={field.value}
                  onChange={field.onChange}
                  config={{
                    readonly: !canEdit || isSubmitting,
                    placeholder: "Write your blog content here...",
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
                      "paragraph",
                      "|",
                      "image",
                      "video",
                      "table",
                      "link",
                      "|",
                      "align",
                      "|",
                      "undo",
                      "redo",
                      "|",
                      "source",
                    ],
                    height: 500,
                    theme: "dark",
                    style: {
                      fontFamily:
                        "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                    },
                    uploader: {
                      insertImageAsBase64URI: true,
                    },
                  }}
                />
              </div>
            )}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              Please provide meaningful blog content (at least 100 characters)
            </p>
          )}
        </div>

        {/* Form Actions */}
        {canEdit && (
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(`/blogs/${id}`)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !isDirty ||
                isContentEmpty(watch("content")) ||
                (!selectedImage && !blog.thumbnail)
              }
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditBlog;
