// pages/DonationRequests.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import useAxios from "../../hooks/useAxios";

const DonationRequests = () => {
  useTitle("Donation Requests");
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/donation-requests" } });
      return;
    }
    const fetchRequests = async () => {
      try {
        const res = await axiosSecure.get(
          "/api/donation-requests?status=pending"
        );
        setRequests(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user, navigate, axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-amber-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-500 mb-4">
        Pending Donation Requests
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4 space-y-2"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {req.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Location:</span> {req.district},{" "}
              {req.upazila}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Blood Group:</span> {req.bloodGroup}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Needed:</span>{" "}
              {new Date(req.neededDate).toLocaleDateString()} at{" "}
              {new Date(req.neededDate + "T00:00").toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button
              onClick={() => navigate(`/donation-requests/${req.id}`)}
              className="mt-2 inline-block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
            >
              View Details
            </button>
          </div>
        ))}
        {requests.length === 0 && (
          <p className="text-gray-700 dark:text-gray-300">
            No pending requests.
          </p>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;
