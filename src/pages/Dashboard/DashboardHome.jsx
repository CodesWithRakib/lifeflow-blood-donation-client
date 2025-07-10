import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Eye, Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import { useUser } from "../../hooks/useUser";

const DashboardHome = () => {
  const [recentRequests, setRecentRequests] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const user = useUser();
  console.log(user);

  useEffect(() => {
    // This would typically come from an API call
    const dummyData = [
      {
        id: 1,
        recipientName: "Rafiq Ahmed",
        district: "Dhaka",
        upazila: "Mirpur",
        date: "2025-07-10",
        time: "10:00 AM",
        bloodGroup: "A+",
        status: "inprogress",
        donor: { name: "Rakib Islam", email: "rakib@example.com" },
      },
      {
        id: 2,
        recipientName: "Mitu Rahman",
        district: "Chittagong",
        upazila: "Panchlaish",
        date: "2025-07-08",
        time: "02:30 PM",
        bloodGroup: "B-",
        status: "pending",
      },
      {
        id: 3,
        recipientName: "Hasan Kabir",
        district: "Khulna",
        upazila: "Sonadanga",
        date: "2025-07-06",
        time: "11:15 AM",
        bloodGroup: "O+",
        status: "done",
      },
    ];
    setRecentRequests(dummyData);
  }, []);

  // Helper to nicely format statuses
  const formatStatus = (status) => {
    switch (status) {
      case "inprogress":
        return "In Progress";
      case "pending":
        return "Pending";
      case "done":
        return "Done";
      case "canceled":
        return "Canceled";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setRecentRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  const handleDeleteRequest = (id) => {
    setRecentRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== id)
    );
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-6 p-6 rounded-xl bg-amber-100 dark:bg-amber-200/10 shadow">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-700 dark:text-amber-400">
          Welcome back, Rakib!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Here are your latest donation requests.
        </p>
      </div>

      {/* Recent Donation Requests */}
      {recentRequests.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 shadow rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Recent Donation Requests
            </h2>
          </div>

          <div className="overflow-x-auto px-4 py-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-amber-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  <th className="px-4 py-2 text-left">Recipient</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Blood Group</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.slice(0, 3).map((req) => (
                  <tr
                    key={req.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-2">{req.recipientName}</td>
                    <td className="px-4 py-2">
                      {req.district}, {req.upazila}
                    </td>
                    <td className="px-4 py-2">{req.date}</td>
                    <td className="px-4 py-2">{req.time}</td>
                    <td className="px-4 py-2 font-semibold text-amber-600">
                      {req.bloodGroup}
                    </td>
                    <td className="px-4 py-2 capitalize">
                      {formatStatus(req.status)}
                      {req.status === "inprogress" && req.donor && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Donor: {req.donor.name} ({req.donor.email})
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 flex flex-wrap gap-2">
                      {req.status === "inprogress" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(req.id, "done")}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" /> Done
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(req.id, "canceled")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" /> Cancel
                          </button>
                        </>
                      )}
                      <Link to={`/dashboard/edit-donation/${req.id}`}>
                        <button className="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-xs flex items-center gap-1 hover:text-amber-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setRequestToDelete(req.id);
                          setShowDeleteModal(true);
                        }}
                        className="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-xs flex items-center gap-1 hover:text-red-500"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <Link to={`/dashboard/donation-details/${req.id}`}>
                        <button className="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-xs flex items-center gap-1 hover:text-blue-500">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 text-right">
              <Link to="/dashboard/my-donation-requests">
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md font-medium transition">
                  View My All Requests
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
          You haven't made any donation requests yet.
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
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
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Cancel delete"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRequest(requestToDelete)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                aria-label="Confirm delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
