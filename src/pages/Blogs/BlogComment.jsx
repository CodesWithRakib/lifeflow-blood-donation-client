import { useState } from "react";
import { MessageSquare, Send, User, ThumbsUp } from "lucide-react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";

const BlogComment = ({ blogId, comments: initialComments, authorId }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to post a comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosSecure.post(`/blogs/${blogId}/comments`, {
        content: newComment.trim(),
        authorId,
      });

      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setNewComment("");
        toast.success("Comment posted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment");
      console.error("Comment submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast.error("Please login to like comments");
      return;
    }

    try {
      const response = await axiosSecure.patch(`/comments/${commentId}/like`, {
        authorId,
      });

      setComments(
        comments.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              likes: response.data.likes,
              isLiked: response.data.isLiked,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      toast.error("Failed to like comment");
      console.error("Like comment error:", error);
    }
  };

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-amber-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-full h-full p-2 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                disabled={isSubmitting}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Please{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-amber-600 hover:underline"
            >
              login
            </button>{" "}
            to post a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {comment.author.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full p-2 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="flex-grow">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {comment.author.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {/* Add dropdown menu for comment actions if needed */}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-line">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`flex items-center gap-1 text-sm ${
                        comment.isLiked
                          ? "text-amber-600"
                          : "text-gray-500 hover:text-amber-600"
                      }`}
                    >
                      <ThumbsUp
                        className="w-4 h-4"
                        fill={comment.isLiked ? "currentColor" : "none"}
                      />
                      <span>{comment.likes?.length || 0}</span>
                    </button>
                    {/* Add reply functionality if needed */}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default BlogComment;
