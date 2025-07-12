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
  DollarSign,
  Users,
  Shield,
} from "lucide-react";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import useRole from "../../hooks/useRole";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/LoadingSpinner";

const DashboardHome = () => {
  const axiosSecure = useAxios();
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reqError, setReqError] = useState(null);

  const { user, isLoading, isAdmin, isVolunteer, isDonor } = useRole();

  // Fetch recent donation requests for donor only
  useEffect(() => {
    if (isDonor && user?.email) {
      const fetchRequests = async () => {
        setLoading(true);
        try {
          const res = await axiosSecure.get(
            `/api/donation-requests/recent/${user.email}`
          );
          setRecentRequests(res.data.data || []);
        } catch (err) {
          console.error(err);
          setReqError("Failed to load recent donation requests.");
          toast.error("Failed to load requests.");
        } finally {
          setLoading(false);
        }
      };
      fetchRequests();
    }
  }, [axiosSecure, isDonor, user?.email]);

  // Fetch stats for Admin & Volunteer
  const { data: stats = {} } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/dashboard/stats");
      return res.data.data;
    },
    enabled: isAdmin || isVolunteer,
  });

  const formatStatus = (status) => {
    return (
      {
        pending: "Pending",
        inprogress: "In Progress",
        done: "Completed",
        canceled: "Canceled",
      }[status] || status
    );
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/api/donation-requests/status/${id}`, {
        status: newStatus,
      });
      toast.success(`Status updated to ${formatStatus(newStatus)}`);
      setRecentRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch {
      toast.error("Status update failed");
    }
  };

  const handleDeleteRequest = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axiosSecure.delete(`/api/donation-requests/${id}`);
          setRecentRequests((prev) => prev.filter((r) => r._id !== id));
          toast.success("Request deleted");
        } catch {
          toast.error("Delete failed");
        }
      }
    });
  };

  if (isLoading || loading) return <LoadingSpinner fullScreen />;
  if (!user) return <p className="text-center text-red-600">User not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 p-6 rounded-xl bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-800/30 dark:to-amber-700/20 shadow">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="User Avatar"
              className="w-16 h-16 rounded-full border-2 border-amber-500"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-amber-100">
                Welcome back, {user.name}
              </h1>
              <p className="text-gray-600 dark:text-amber-200 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow space-y-3">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Your Info
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <Droplet className="w-4 h-4 text-red-500" />
            Blood Group: <strong>{user.bloodGroup || "Not specified"}</strong>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500" />
            Location:{" "}
            <strong>
              {user.district}, {user.upazila}
            </strong>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UserIcon className="w-4 h-4 text-amber-500" />
            Status:{" "}
            <strong
              className={`${
                user.status === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {user.status}
            </strong>
          </div>
        </div>
      </div>

      {/* Admin/Volunteer Stats */}
      {(isAdmin || isVolunteer) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4">
            <Users className="w-8 h-8 text-amber-500" />
            <div>
              <p className="text-sm text-gray-500">Total Donors</p>
              <h4 className="text-xl font-bold">{stats.totalUsers || 0}</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4">
            <DollarSign className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Total Funding</p>
              <h4 className="text-xl font-bold">৳ {stats.totalFunding || 0}</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4">
            <Droplet className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Donation Requests</p>
              <h4 className="text-xl font-bold">{stats.totalRequests || 0}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Donor Recent Requests */}
      {isDonor && recentRequests.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Your Recent Donation Requests
            </h2>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-amber-100 dark:bg-gray-800 text-left text-gray-700 dark:text-gray-300">
                  <th className="p-2">Recipient</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Date/Time</th>
                  <th className="p-2">Blood Group</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-2">{req.recipientName}</td>
                    <td className="p-2">
                      {req.district}, {req.upazila}
                    </td>
                    <td className="p-2">
                      {format(new Date(req.date), "MMM dd")} at {req.time}
                    </td>
                    <td className="p-2">{req.bloodGroup}</td>
                    <td className="p-2">
                      {formatStatus(req.status)}
                      {req.status === "inprogress" && req.donor && (
                        <div className="text-xs text-gray-500">
                          Donor: {req.donor.name}
                        </div>
                      )}
                    </td>
                    <td className="p-2 space-x-2">
                      {req.status === "inprogress" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(req._id, "done")}
                            className="text-green-600 text-xs"
                          >
                            <CheckCircle className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(req._id, "canceled")
                            }
                            className="text-red-600 text-xs"
                          >
                            <XCircle className="w-4 h-4 inline" />
                          </button>
                        </>
                      )}
                      <Link to={`/dashboard/edit-donation/${req._id}`}>
                        <Edit className="inline w-4 h-4 hover:text-amber-500" />
                      </Link>
                      <button
                        onClick={() => handleDeleteRequest(req._id)}
                        className="text-red-500"
                      >
                        <Trash className="inline w-4 h-4" />
                      </button>
                      <Link to={`/dashboard/donation-details/${req._id}`}>
                        <Eye className="inline w-4 h-4 hover:text-blue-500" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4">
              <Link
                to="/dashboard/my-donation-requests"
                className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
              >
                View My All Requests
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
