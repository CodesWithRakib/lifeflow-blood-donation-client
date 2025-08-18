import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
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
  Users,
  TrendingUp,
  ChevronRight,
  RefreshCw,
  Shield,
  HandHeart,
  Map,
} from "lucide-react";
import { useUser } from "../../../hooks/useUser";
import useTitle from "../../../hooks/useTitle";

const VolunteerHome = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const { data: userData } = useUser();
  useTitle("Volunteer Home | LifeFlow - Blood Donation");

  const [activeTab, setActiveTab] = useState("requests");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch volunteer stats
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["volunteer-stats", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/api/volunteers/stats/${user?.email}`
      );
      return data;
    },
    enabled: !!user?.email,
  });

  // Fetch donation requests
  const {
    data: donationRequests,
    isLoading: requestsLoading,
    refetch: refetchRequests,
  } = useQuery({
    queryKey: ["volunteer-requests", statusFilter],
    queryFn: async () => {
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const { data } = await axiosSecure.get("/donations", { params });
      return data;
    },
    enabled: !!user?.email,
  });

  // Fetch recent activities
  const {
    data: recentActivities,
    isLoading: activitiesLoading,
    refetch: refetchActivities,
  } = useQuery({
    queryKey: ["volunteer-activities", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/api/volunteers/activities/${user?.email}`
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
      toast.success(`Request status updated to ${newStatus}`, { id: toastId });
      refetchRequests();
      refetchActivities();
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
          refetchRequests();
          refetchActivities();
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };

  const handleRefreshData = () => {
    refetchStats();
    refetchRequests();
    refetchActivities();
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

  const statusOptions = [
    { value: "all", label: "All Requests" },
    { value: "pending", label: "Pending" },
    { value: "inprogress", label: "In Progress" },
    { value: "done", label: "Completed" },
    { value: "canceled", label: "Canceled" },
  ];

  if (statsLoading || requestsLoading || activitiesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full p-4 space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-xl p-6 text-white"
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
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, {user?.displayName}!
              </h1>
              <p className="text-green-100 flex items-center gap-1 mt-2">
                <HandHeart className="w-4 h-4" />
                <span>Thank you for being a volunteer hero</span>
              </p>
              <p className="text-green-200 text-sm mt-1">
                Making a difference in your community
              </p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-300" />
              <div>
                <p className="text-sm text-green-100">Volunteer Level</p>
                <p className="font-bold text-lg">Community Hero</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Requests Handled
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Activity className="w-6 h-6 text-green-500" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.data?.requestsHandled || 0}
                </p>
              </div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                Lives Impacted
              </p>
              <div className="flex items-center gap-2 mt-1">
                <HeartPulse className="w-6 h-6 text-red-500" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.data?.livesImpacted || 0}
                </p>
              </div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <HeartPulse className="w-6 h-6 text-red-600 dark:text-red-400" />
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
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Success Rate
              </p>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.data?.successRate || 0}%
                </p>
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Active Status
              </p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                  {userData?.status || "Unknown"}
                </p>
              </div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="flex border-b border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("requests")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "requests"
                    ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Donation Requests
              </button>
              <button
                onClick={() => setActiveTab("activities")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "activities"
                    ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Recent Activities
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "requests" && (
                <>
                  {/* Filter and Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <select
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-green-600 dark:focus:border-green-600"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <button
                      onClick={handleRefreshData}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>

                  {/* Requests Table */}
                  {donationRequests?.data?.length > 0 ? (
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
                                    {format(
                                      new Date(request.date),
                                      "MMM dd, yyyy"
                                    )}
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
                                  {request.status === "inprogress" &&
                                    request.donor && (
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
                                        `/dashboard/donation-details/${request._id}`
                                      )
                                    }
                                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 transition-colors"
                                    title="View details"
                                  >
                                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  </button>
                                  {request.status === "pending" && (
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          request._id,
                                          "inprogress"
                                        )
                                      }
                                      className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 transition-colors"
                                      title="Mark as in progress"
                                    >
                                      <HeartPulse className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </button>
                                  )}
                                  {request.status === "inprogress" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleStatusUpdate(
                                            request._id,
                                            "done"
                                          )
                                        }
                                        className="p-2 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-800 transition-colors"
                                        title="Mark as completed"
                                      >
                                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleStatusUpdate(
                                            request._id,
                                            "canceled"
                                          )
                                        }
                                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800 transition-colors"
                                        title="Cancel request"
                                      >
                                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleDeleteRequest(request._id)
                                    }
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
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Droplet className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No donation requests found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
                        When donation requests are available, they'll appear
                        here for you to manage.
                      </p>
                      <Link
                        to="/dashboard/create-donation-request"
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Create Request
                      </Link>
                    </div>
                  )}
                </>
              )}

              {activeTab === "activities" && (
                <>
                  {/* Activities List */}
                  {recentActivities?.data?.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.data.map((activity, index) => (
                        <motion.div
                          key={activity._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                activity.type === "status_update"
                                  ? "bg-blue-100 dark:bg-blue-900/30"
                                  : activity.type === "donation"
                                  ? "bg-green-100 dark:bg-green-900/30"
                                  : "bg-purple-100 dark:bg-purple-900/30"
                              }`}
                            >
                              {activity.type === "status_update" && (
                                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              )}
                              {activity.type === "donation" && (
                                <HeartPulse className="w-4 h-4 text-green-600 dark:text-green-400" />
                              )}
                              {activity.type === "request" && (
                                <Droplet className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {activity.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                {format(
                                  new Date(activity.createdAt),
                                  "MMM d, yyyy 'at' h:mm a"
                                )}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No recent activities
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Your volunteer activities will appear here as you help
                        manage donation requests.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Map className="w-5 h-5 text-green-500" />
              <span>Quick Actions</span>
            </h3>
            <div className="space-y-3">
              <Link
                to="/dashboard/create-donation-request"
                className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Droplet className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Create Request
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    New donation request
                  </p>
                </div>
              </Link>
              <Link
                to="/dashboard/my-donation-requests"
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    My Requests
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    View all requests
                  </p>
                </div>
              </Link>
              <Link
                to="/dashboard/donors-nearby"
                className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Find Donors
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nearby donors
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span>This Month</span>
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Requests Handled
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats?.data?.monthlyRequests || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (stats?.data?.monthlyRequests || 0) * 10,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Lives Impacted
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats?.data?.monthlyLives || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (stats?.data?.monthlyLives || 0) * 20,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Success Rate
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats?.data?.monthlySuccessRate || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${stats?.data?.monthlySuccessRate || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span>Upcoming Events</span>
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <p className="font-medium text-gray-900 dark:text-white">
                  Blood Donation Camp
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  July 25, 2023
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <p className="font-medium text-gray-900 dark:text-white">
                  Volunteer Training
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  August 5, 2023
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <p className="font-medium text-gray-900 dark:text-white">
                  Community Outreach
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  August 20, 2023
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerHome;
