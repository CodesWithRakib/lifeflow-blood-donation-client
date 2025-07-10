import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Clock,
  Droplet,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

const DashboardHome = () => {
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const axiosSecure = useAxios();

  // Fetch user data with proper error handling
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get("/api/user");
        return data;
      } catch (error) {
        throw new Error("Failed to fetch user data");
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch recent requests with dependency on user._id
  useEffect(() => {
    const fetchRecentRequests = async () => {
      if (!user?._id) return;

      setLoading(true);
      setError(null);
      try {
        const res = await axiosSecure.get("/api/donation-requests/recent");
        setRecentRequests(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError("Failed to load recent donation requests.");
        toast.error("Failed to load recent donation requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRequests();
  }, [axiosSecure, user?._id]);

  const formatStatus = (status) => {
    const statusMap = {
      inprogress: "In Progress",
      pending: "Pending",
      done: "Completed",
      canceled: "Canceled",
    };
    return (
      statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
    );
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/api/donation-requests/status/${id}`, {
        status: newStatus,
      });

      setRecentRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status: newStatus } : request
        )
      );
      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await axiosSecure.delete(`/api/donation-requests/${id}`);
      setRecentRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== id)
      );
      setShowDeleteModal(false);
      toast.success("Request deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete request");
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* User Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 p-6 rounded-xl bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 shadow">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt={user?.name || "User"}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
              />
              {user?.status === "active" && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-amber-100">
                Welcome back, {user?.name || "User"}
              </h1>
              <p className="text-gray-600 dark:text-amber-200">
                {user?.role === "admin"
                  ? "Administrator"
                  : user?.role === "volunteer"
                  ? "Volunteer"
                  : "Blood Donor"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
            Your Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-red-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Blood Group:{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {user?.bloodGroup || "Not specified"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Location:{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {user?.district || "Unknown"}, {user?.upazila || "Unknown"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-amber-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    user?.status === "active"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {user?.status?.charAt(0).toUpperCase() +
                    user?.status?.slice(1) || "Unknown"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Recent Donation Requests
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {format(new Date(), "MMM dd, yyyy h:mm a")}
          </span>
        </div>

        {recentRequests.length > 0 ? (
          <div className="overflow-x-auto px-4 py-4">
            <table className="min-w-full text-sm">
              {/* Table headers */}
              <thead>
                <tr className="bg-amber-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  <th className="px-4 py-3 text-left">Recipient</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Date/Time</th>
                  <th className="px-4 py-3 text-left">Blood Group</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody>
                {recentRequests.slice(0, 5).map((req) => (
                  <tr
                    key={req._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{req.recipientName}</div>
                      {req.hospitalName && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {req.hospitalName}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {req.district}, {req.upazila}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(req.date), "MMM dd")} at {req.time}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                        {req.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          req.status === "pending"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                            : req.status === "inprogress"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : req.status === "done"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {formatStatus(req.status)}
                      </span>
                      {req.status === "inprogress" && req.donor && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Donor: {req.donor.name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {req.status === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "done")
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                              title="Mark as completed"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "canceled")
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                              title="Cancel request"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/dashboard/edit-donation/${req._id}`}
                          title="Edit request"
                        >
                          <button className="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-xs flex items-center gap-1 hover:text-amber-600">
                            <Edit className="w-3 h-3" />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setRequestToDelete(req._id);
                            setShowDeleteModal(true);
                          }}
                          className="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-xs flex items-center gap-1 hover:text-red-500"
                          title="Delete request"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                        <Link
                          to={`/dashboard/donation-details/${req._id}`}
                          title="View details"
                        >
                          <button className="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-xs flex items-center gap-1 hover:text-blue-500">
                            <Eye className="w-3 h-3" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 text-right">
              <Link to="/dashboard/my-donation-requests">
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md font-medium transition">
                  View All Requests
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto max-w-md">
              <img
                src="/empty-state.svg"
                alt="No requests"
                className="w-40 h-40 mx-auto opacity-70"
              />
              <h3 className="mt-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                No donation requests yet
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                You haven't created any donation requests. Create your first
                request to get started.
              </p>
              <div className="mt-6">
                <Link
                  to="/dashboard/create-donation-request"
                  className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium transition"
                >
                  Create New Request
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this donation request? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRequest(requestToDelete)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
