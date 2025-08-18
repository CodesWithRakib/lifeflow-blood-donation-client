import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "motion/react";
import useAxios from "../../../hooks/useAxios";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import useAuth from "../../../hooks/useAuth";
import { format } from "date-fns";
import {
  Droplet,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Clock,
  Calendar,
  HeartPulse,
  AlertCircle,
  Activity,
  Award,
  TrendingUp,
} from "lucide-react";
import { useUser } from "../../../hooks/useUser";
import useTitle from "../../../hooks/useTitle";

const DonorHome = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const { data: userData } = useUser();
  useTitle("Donor Home | LifeFlow - Blood Donation");

  const {
    data: donationRequests,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["recentDonations", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/donations/recent/${user?.email}`
      );
      return data;
    },
    enabled: !!user?.email,
  });

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const toastId = toast.loading("Updating status...");
      const { data } = await axiosSecure.patch(`/requests/status/${id}`, {
        status: newStatus,
      });
      if (!data.success) {
        throw new Error(data.message || "Failed to update status");
      }
      toast.success(`Donation status updated to ${newStatus}`, { id: toastId });
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteRequest = async (id) => {
    Swal.fire({
      title: "Delete Donation Request?",
      text: "This will permanently remove this request. Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "#1f2937"
          : "#fff",
      color:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "#fff"
          : "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const toastId = toast.loading("Deleting request...");
          const { data } = await axiosSecure.delete(`/requests/${id}`);
          if (!data.success) {
            throw new Error(
              data.message || "Failed to delete donation request"
            );
          }
          toast.success("Donation request deleted successfully", {
            id: toastId,
          });
          refetch();
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };

  const statusStyles = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    inprogress:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    done: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    canceled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  const statusIcons = {
    pending: <Clock className="w-3 h-3" />,
    inprogress: <HeartPulse className="w-3 h-3" />,
    done: <CheckCircle className="w-3 h-3" />,
    canceled: <XCircle className="w-3 h-3" />,
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="text-red-500 dark:text-red-400 p-4">
        Error loading donation requests
      </div>
    );

  return (
    <div className="w-full p-4 space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.photoURL || "/default-avatar.png"}
                alt="User Avatar"
                className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, {user?.displayName}!
              </h1>
              <p className="text-red-100 flex items-center gap-1 mt-2">
                <HeartPulse className="w-4 h-4" />
                <span>Thank you for being a blood donor hero</span>
              </p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-300" />
              <div>
                <p className="text-sm text-red-100">Donor Level</p>
                <p className="font-bold text-lg">Gold Donor</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Blood Group
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Droplet className="w-6 h-6 text-red-500" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userData?.bloodGroup || "Not specified"}
                </p>
              </div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <Droplet className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Location
              </p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-6 h-6 text-blue-500" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {userData?.district || "Unknown"}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm ml-8">
                {userData?.upazila || "Unknown"}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    userData?.status === "active"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                  }`}
                >
                  {userData?.status === "active" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                  {userData?.status || "Unknown"}
                </p>
              </div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Donation Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
              <Droplet className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Your Recent Donation Requests
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track and manage your donation requests
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/my-donation-requests"
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            View All Requests
          </Link>
        </div>

        {donationRequests?.data?.length > 0 ? (
          <>
            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                      Date/Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Blood Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {donationRequests.data.map((request, index) => (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {request.recipientName || request.patientName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 sm:hidden mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {request.recipientDistrict},{" "}
                              {request.recipientUpazila}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {format(new Date(request.date), "MMM dd")}
                            </span>
                            <Clock className="w-3 h-3 ml-2" />
                            <span>{request.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>
                            {request.recipientDistrict},{" "}
                            {request.recipientUpazila}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span>
                            {format(new Date(request.date), "MMM dd, yyyy")}
                          </span>
                          <Clock className="w-4 h-4 text-blue-500 ml-2" />
                          <span>{request.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-1 w-min">
                          <Droplet className="w-3 h-3" />
                          {request.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                              statusStyles[request.status]
                            } flex items-center gap-1 w-min`}
                          >
                            {statusIcons[request.status]}
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                          {request.status === "inprogress" && request.donor && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                              <div>Donor: {request.donor.name}</div>
                              <div className="truncate max-w-[120px]">
                                {request.donor.email}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/donation-request/${request._id}`
                              )
                            }
                            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/edit-donation/${request._id}`
                              )
                            }
                            className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-800 transition-colors"
                            title="Edit request"
                          >
                            <Edit className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </button>
                          {request.status === "inprogress" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(request._id, "done")
                                }
                                className="p-2 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-800 transition-colors"
                                title="Mark as completed"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(request._id, "canceled")
                                }
                                className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800 transition-colors"
                                title="Cancel request"
                              >
                                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteRequest(request._id)}
                            className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800 transition-colors"
                            title="Delete request"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {donationRequests.data.length} of{" "}
                {donationRequests.data.length} requests
              </div>
              <div className="flex gap-2">
                <button
                  disabled={true}
                  className="px-4 py-2 border dark:text-white border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  disabled={true}
                  className="px-4 py-2 border dark:text-white border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6"
            >
              <Droplet className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No donation requests yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
              When you create donation requests, they'll appear here for easy
              tracking.
            </p>
            <Link
              to="/dashboard/create-donation-request"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Create Your First Request
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DonorHome;
