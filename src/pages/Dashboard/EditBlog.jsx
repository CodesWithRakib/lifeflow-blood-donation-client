import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Bookmark, Edit, Eye, Save, Trash2, Upload } from "lucide-react";
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
  } = useForm();

  // Fetch blog data and check admin status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check admin status
        const adminCheck = await axiosSecure.get("/api/users/check-admin");
        setIsAdmin(adminCheck.data.isAdmin);

        // Fetch blog data
        const response = await axiosSecure.get(`/api/blogs/${id}`);

        if (!response.data.success) {
          throw new Error("Blog not found");
        }

        setBlog(response.data.data);
        reset({
          title: response.data.data.title,
          content: response.data.data.content,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Failed to load blog");
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, axiosSecure, reset, navigate]);

  // Handle image selection
  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Submit updated blog
  const onSubmit = async (data) => {
    if (!data.content || data.content === "<p><br></p>") {
      toast.error("Please add blog content");
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
      toast.error(error.response?.data?.message || "Failed to update blog", {
        id: toastId,
      });
      console.error("Blog update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete blog
  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error("Only admin can delete blogs");
      return;
    }

    const result = await Swal.fire({
      title: "Delete Blog Post?",
      text: "This action cannot be undone. All comments and associated data will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete Permanently",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/api/blogs/${id}`);
        if (response.data.success) {
          toast.success("Blog deleted successfully");
          navigate("/blogs");
        }
      } catch (error) {
        toast.error("Failed to delete blog");
        console.error("Delete error:", error);
      }
    }
  };

  // Change blog status
  const handleStatusChange = async (newStatus) => {
    if (!isAdmin) {
      toast.error("Only admin can change status");
      return;
    }

    try {
      const response = await axiosSecure.patch(`/api/blogs/${id}/status`, {
        status: newStatus,
      });

      if (response.data.success) {
        setBlog({ ...blog, status: newStatus });
        toast.success(`Blog status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Status update error:", error);
    }
  };

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
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Edit Blog Post
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/blogs/${id}`)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Eye className="inline mr-2 w-4 h-4" />
            Preview
          </button>

          {canEdit && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              <Trash2 className="inline mr-2 w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Status Badge and Controls */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            blog.status === "published"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : blog.status === "draft"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
        </span>

        {isAdmin && (
          <div className="flex gap-2">
            {blog.status === "draft" ? (
              <button
                onClick={() => handleStatusChange("published")}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                Publish
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange("draft")}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Unpublish
              </button>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
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
            disabled={!canEdit}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Thumbnail Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Thumbnail Image
          </label>
          <div className="flex items-center gap-4">
            {previewImage ? (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-md"
                />
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewImage("");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="h-24 w-24 object-cover rounded-md"
              />
            )}

            {canEdit && (
              <label className="flex flex-col items-center px-4 py-3 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-500 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {previewImage ? "Change Image" : "Upload New Image"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={onImageChange}
                  disabled={isSubmitting}
                />
              </label>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Recommended size: 1200x630 pixels (max 5MB)
          </p>
        </div>

        {/* Content Editor */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content *
          </label>
          <Controller
            name="content"
            control={control}
            rules={{ validate: (value) => value && value !== "<p><br></p>" }}
            render={({ field }) => (
              <div
                className={`border rounded-md overflow-hidden ${
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
                    readonly: !canEdit,
                    placeholder: "Write your blog content here...",
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
                    height: 500,
                    style: {
                      fontFamily:
                        "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                    },
                  }}
                />
              </div>
            )}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              Please provide valid blog content
            </p>
          )}
        </div>

        {/* Form Actions */}
        {canEdit && (
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(`/blogs/${id}`)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md disabled:opacity-50"
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
