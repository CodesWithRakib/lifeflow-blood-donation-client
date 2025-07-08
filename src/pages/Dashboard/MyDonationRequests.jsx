import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Eye, Edit, Trash, CheckCircle, XCircle } from "lucide-react";

const MyDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Fetch from backend in real use
    const dummyRequests = [
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
    setRequests(dummyRequests);
  }, []);

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-amber-600">
          My Donation Requests
        </h1>
        <select
          className="border rounded px-3 py-1 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
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
              {filteredRequests.map((req) => (
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
                  <td className="px-4 py-2">{req.bloodGroup}</td>
                  <td className="px-4 py-2 capitalize">{req.status}</td>
                  <td className="px-4 py-2 flex flex-wrap gap-2">
                    {req.status === "inprogress" && (
                      <>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Done
                        </button>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Cancel
                        </button>
                      </>
                    )}
                    <Link to={`/dashboard/edit-donation/${req.id}`}>
                      <button className="border px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button className="border px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Trash className="w-4 h-4" />
                    </button>
                    <Link to={`/dashboard/donation-details/${req.id}`}>
                      <button className="border px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No donation requests found.
        </p>
      )}
    </div>
  );
};

export default MyDonationRequests;
