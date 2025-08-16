import React, { useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { format } from "date-fns";
import {
  FaUser,
  FaTint,
  FaMapMarkerAlt,
  FaHospital,
  FaClock,
  FaCalendarAlt,
  FaEnvelopeOpenText,
  FaInfoCircle,
  FaHandsHelping,
  FaNotesMedical,
  FaPhone,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "motion/react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import BloodDropIcon from "../../components/common/BloodDropIcon";
import useTitle from "../../hooks/useTitle";

// Memoized Detail Card Component
const DetailCard = React.memo(({ icon, title, value, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">{icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          {title}
        </h4>
        <p className="text-base text-gray-800 dark:text-gray-200 break-words">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
));

// Memoized Blood Type Badge Component
const BloodTypeBadge = React.memo(({ bloodGroup }) => {
  const getBadgeStyle = () => {
    switch (bloodGroup) {
      case "O-":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "O+":
        return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "A+":
      case "A-":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "B+":
      case "B-":
        return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    }
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold ${getBadgeStyle()}`}
    >
      {bloodGroup}
    </span>
  );
});

// Memoized Status Badge Component
const StatusBadge = React.memo(({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "inprogress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle()}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
});

const DonationRequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const { user } = useAuth();
  useTitle("Donation Request Details | LifeFlow - Blood Donation");

  const {
    data: request,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["donation-details", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/requests/${id}`);
      return data?.data;
    },
    retry: 2,
  });

  const mutation = useMutation({
    mutationFn: async (donationInfo) => {
      const res = await axiosSecure.patch(
        `/requests/${id}/donate`,
        donationInfo
      );
      return res.data;
    },
    onSuccess: () => {
      navigate("/dashboard/my-donations");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to confirm donation"
      );
    },
  });

  // Format date and time
  const formattedDateTime = useMemo(() => {
    if (!request) return "";
    return `${format(new Date(request.date), "PPP")} at ${request.time}`;
  }, [request]);

  // Handle donation confirmation
  const handleDonate = useCallback(() => {
    if (!user) {
      return toast.error("Please login to donate");
    }
    if (!request) {
      return toast.error("Request data not loaded");
    }
    if (request.status !== "pending") {
      return toast.error("This request is no longer available for donation.");
    }
    if (request.requesterEmail === user?.email) {
      return toast.error("You cannot donate to your own request.");
    }
    Swal.fire({
      title: "Confirm Your Donation Commitment",
      html: `
        <div class="text-left space-y-4">
          <!-- Donor Information Section -->
          <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
            <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-3">Your Information</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value="${user?.displayName || "Not provided"}" 
                  readonly
                  class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white text-sm"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  value="${user?.email || "Not provided"}" 
                  readonly
                  class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white text-sm"
                >
              </div>
            </div>
          </div>
          
          <!-- Donation Details Section -->
          <p class="font-medium text-gray-700 dark:text-gray-200">You're committing to donate for:</p>
          <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
            <div class="flex items-start gap-3">
              ${
                user?.photoURL
                  ? `<img src="${user.photoURL}" class="w-10 h-10 rounded-full object-cover" alt="Recipient">`
                  : ""
              }
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">${
                  request.patientName || request.recipientName
                }</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">${
                  request.hospitalName
                }</p>
                <div class="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  ${format(new Date(request.date), "PPP")}
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ${request.time}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Warning Section -->
          <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
            <div class="flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-sm font-medium text-amber-800 dark:text-amber-200">
                Please ensure you're available on the specified date and meet all donation requirements.
              </p>
            </div>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#E53E3E",
      cancelButtonColor: "#4B5563",
      confirmButtonText: "Confirm Donation",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const result = await mutation.mutateAsync({
            donor: {
              name: user?.displayName || "Anonymous Donor",
              email: user?.email || "no-email-provided@example.com",
              avatar: user?.photoURL || null,
            },
            status: "inprogress",
            donationId: id,
          });
          return result;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error.message}`);
          return false;
        }
      },
      customClass: {
        popup: "rounded-xl !bg-white dark:!bg-gray-800",
        htmlContainer: "!text-left",
        title: "!text-gray-900 dark:!text-white",
        closeButton:
          "!text-gray-400 hover:!text-gray-900 dark:hover:!text-white",
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        toast.success("Donation confirmed successfully!");
      }
    });
  }, [user, request, mutation, id]);

  // Handle navigation back
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <ErrorMessage
          message={error.message || "Failed to load donation details"}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Donation Request Not Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The requested donation details could not be found or may have been
            removed.
          </p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition flex items-center justify-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Back to Previous Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-800 dark:to-red-900 px-6 py-4 flex items-center">
          <motion.div
            animate={{
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <BloodDropIcon className="w-10 h-10 text-white mr-3" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Blood Donation Request
            </h2>
            <p className="text-red-100 flex items-center gap-2">
              <BloodTypeBadge bloodGroup={request.bloodGroup} />
              <span>•</span>
              <span>{request.recipientDistrict}</span>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Patient Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Please review all details carefully before donating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailCard
              icon={<FaUser className="text-red-500" />}
              title="Patient Name"
              value={request.patientName || request.recipientName || "N/A"}
              className="bg-white dark:bg-gray-700"
            />
            <DetailCard
              icon={<FaTint className="text-red-500" />}
              title="Blood Group"
              value={<BloodTypeBadge bloodGroup={request.bloodGroup} />}
              className="bg-white dark:bg-gray-700"
            />
            <DetailCard
              icon={<FaHospital className="text-amber-500" />}
              title="Hospital"
              value={request.hospitalName || "N/A"}
              className="bg-white dark:bg-gray-700"
            />
            <DetailCard
              icon={<FaMapMarkerAlt className="text-blue-500" />}
              title="Location"
              value={`${request.recipientUpazila || "N/A"}, ${
                request.recipientDistrict || "N/A"
              }`}
              className="bg-white dark:bg-gray-700"
            />
            <DetailCard
              icon={<FaCalendarAlt className="text-green-500" />}
              title="Date & Time"
              value={formattedDateTime}
              className="bg-white dark:bg-gray-700"
            />
            <DetailCard
              icon={<FaNotesMedical className="text-purple-500" />}
              title="Status"
              value={<StatusBadge status={request.status} />}
              className="bg-white dark:bg-gray-700"
            />
          </div>

          {request.hospitalAddress && (
            <DetailCard
              icon={<FaMapMarkerAlt className="text-blue-500" />}
              title="Hospital Address"
              value={request.hospitalAddress}
              className="mt-6 bg-white dark:bg-gray-700"
            />
          )}

          {request.contactPhone && (
            <DetailCard
              icon={<FaPhone className="text-green-500" />}
              title="Contact Number"
              value={request.contactPhone}
              className="mt-6 bg-white dark:bg-gray-700"
            />
          )}

          {request.reason && (
            <DetailCard
              icon={<FaInfoCircle className="text-amber-500" />}
              title="Reason for Emergency"
              value={request.reason}
              className="mt-6 bg-white dark:bg-gray-700"
            />
          )}

          <DetailCard
            icon={<FaEnvelopeOpenText className="text-gray-500" />}
            title="Additional Message"
            value={request.message || "No additional message provided."}
            className="mt-6 bg-gray-50 dark:bg-gray-700"
          />

          {request.status === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row justify-end gap-4"
            >
              <button
                onClick={handleGoBack}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>
              <button
                onClick={handleDonate}
                disabled={mutation.isLoading}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 rounded-lg text-white font-medium hover:from-red-700 hover:to-amber-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {mutation.isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaHandsHelping /> Donate Now
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DonationRequestDetails;
