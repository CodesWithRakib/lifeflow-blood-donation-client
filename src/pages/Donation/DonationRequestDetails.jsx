// pages/DonationRequestDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import useTitle from "../../hooks/useTitle";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const DonationRequestDetails = () => {
  useTitle("Request Details");
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: `/donation-requests/${id}` } });
      return;
    }
    const fetchRequest = async () => {
      try {
        const res = await axiosSecure.get(`/api/donation-requests/${id}`);
        setRequest(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load request");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id, user, navigate, axiosSecure]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await axiosSecure.patch(`/api/donation-requests/status/${id}`, {
        status: "inprogress",
      });
      toast.success("Thank you for donating! Status updated.");
      setShowModal(false);
      navigate("/donation-requests");
    } catch (err) {
      console.error(err);
      toast.error("Donation confirmation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!request) {
    return <p className="p-6 text-center text-red-500">Request not found.</p>;
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-500">
          Donation Request Details
        </h1>

        <p>
          <span className="font-medium">Recipient:</span>{" "}
          {request.recipientName || request.name}
        </p>
        <p>
          <span className="font-medium">Location:</span> {request.district},{" "}
          {request.upazila}
        </p>
        <p>
          <span className="font-medium">Blood Group:</span> {request.bloodGroup}
        </p>
        <p>
          <span className="font-medium">Hospital:</span> {request.hospital}
        </p>
        <p>
          <span className="font-medium">Needed Date:</span>{" "}
          {new Date(request.date || request.neededDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Time:</span> {request.time}
        </p>
        <p>
          <span className="font-medium">Status:</span> {request.status}
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
        >
          Donate
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Confirm Donation
            </h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Donor Name
                </label>
                <input
                  value={user.displayName || user.email}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Donor Email
                </label>
                <input
                  value={user.email}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequestDetails;
