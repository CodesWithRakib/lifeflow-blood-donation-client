import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Droplet,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "date-fns";

const MySwal = withReactContent(Swal);

const MyDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxios();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosSecure.get(
          `/api/donation-requests?requesterEmail=${user?.email}`
        );
        setRequests(res.data?.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch donation requests");
        setError("Failed to load donation requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchRequests();
  }, [axiosSecure, user?.email]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/api/donation-requests/status/${id}`, {
        status: newStatus,
      });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: newStatus, updatedAt: new Date() } : r
        )
      );
      toast.success(`Request marked as ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "dark:bg-gray-800 dark:text-white",
        title: "dark:text-white",
        content: "dark:text-gray-300",
        confirmButton: "hover:bg-red-700 transition-colors",
        cancelButton: "hover:bg-blue-600 transition-colors",
      },
      background: "#ffffff dark:bg-gray-800",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/api/donation-requests/${id}`);
        setRequests((prev) => prev.filter((r) => r._id !== id));
        MySwal.fire({
          title: "Deleted!",
          text: "Your request has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "dark:bg-gray-800 dark:text-white",
          },
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete request");
      }
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      pending: {
        text: "Pending",
        color:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      },
      inprogress: {
        text: "In Progress",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      },
      done: {
        text: "Completed",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      },
      canceled: {
        text: "Canceled",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      },
    };
    return (
      statusMap[status] || {
        text: status,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      }
    );
  };

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="inline-block p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">
            My Donation Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredRequests.length} request
            {filteredRequests.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-amber-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Recipient
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" /> Location
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" /> Date
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> Time
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Droplet className="w-4 h-4 mr-1" /> Blood Group
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {req.recipientName}
                      </div>
                      {req.hospitalName && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {req.hospitalName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {req.district}, {req.upazila}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {format(new Date(req.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {req.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {req.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          formatStatus(req.status).color
                        }`}
                      >
                        {formatStatus(req.status).text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {req.status === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "done")
                              }
                              className="text-green-600 hover:text-green-900 dark:hover:text-green-400 p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                              title="Mark as completed"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "canceled")
                              }
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              title="Cancel request"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/dashboard/edit-donation/${req._id}`}
                          className="text-amber-600 hover:text-amber-900 dark:hover:text-amber-400 p-1 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                          title="Edit request"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete request"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                        <Link
                          to={`/dashboard/donation-details/${req._id}`}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400">
              No donation requests found.{" "}
              <Link
                to="/dashboard/create-donation-request"
                className="text-amber-600 dark:text-amber-400 hover:underline"
              >
                Create your first request
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonationRequests;
