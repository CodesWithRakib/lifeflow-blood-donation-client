import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { useUser } from "../../../hooks/useUser";

const DonorHome = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const { data: userData } = useUser();
  // Fetch recent donation requests
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

      const { data } = await axiosSecure.patch(`/donations/status/${id}`, {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const toastId = toast.loading("Deleting request...");

          const { data } = await axiosSecure.delete(`/donations/${id}`);

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

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading donation requests</div>;

  return (
    <div className="max-w-7xl mx-auto ">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 p-6 rounded-xl bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-800/30 dark:to-amber-700/20 shadow">
          <div className="flex items-center gap-4">
            <img
              src={user?.photoURL || "/default-avatar.png"}
              alt="User Avatar"
              className="w-16 h-16 rounded-full border-2 border-amber-500"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-amber-100">
                Welcome back, {user?.displayName}
              </h1>
              <p className="text-gray-600 dark:text-amber-200 capitalize">
                Blood Donor
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
            Blood Group:{" "}
            <strong>{userData?.bloodGroup || "Not specified"}</strong>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500" />
            Location:{" "}
            <strong>
              {userData?.district || "Unknown"},{" "}
              {userData?.upazila || "Unknown"}
            </strong>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-amber-500" />
            Status:{" "}
            <strong className="text-green-600 dark:text-green-400">
              Active
            </strong>
          </div>
        </div>
      </div>

      {/* Recent Donation Requests Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Your Recent Donation Requests
          </h2>
        </div>

        {donationRequests?.data?.length > 0 ? (
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
                {donationRequests.data.map((request) => (
                  <tr
                    key={request._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-2 font-medium">{request.recipientName}</td>
                    <td className="p-2">
                      {request.recipientDistrict}, {request.recipientUpazila}
                    </td>
                    <td className="p-2">
                      {format(new Date(request.date), "MMM dd")} at{" "}
                      {request.time}
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {request.bloodGroup}
                      </span>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusStyles[request.status]
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                      {request.status === "inprogress" && request.donor && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Donor: {request.donor.name} ({request.donor.email})
                        </div>
                      )}
                    </td>
                    <td className="p-2 space-x-2">
                      {request.status === "inprogress" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(request._id, "done")
                            }
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            title="Mark as completed"
                          >
                            <CheckCircle className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(request._id, "canceled")
                            }
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Cancel request"
                          >
                            <XCircle className="w-4 h-4 inline" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() =>
                          navigate(`/dashboard/edit-donation/${request._id}`)
                        }
                        className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
                        title="Edit request"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(request._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete request"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/donation-details/${request._id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            You haven't made any donation requests yet. When you do, they'll
            appear here.
          </div>
        )}

        <div className="px-6 py-4 border-t dark:border-gray-800 text-right">
          <Link
            to="/my-donation-requests"
            className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            View All My Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DonorHome;
