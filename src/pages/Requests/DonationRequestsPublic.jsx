import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios"; // Use your custom hook
import { motion } from "motion/react";
import { format, differenceInDays } from "date-fns";
import {
  FaHeartbeat,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaHospital,
  FaPhone,
  FaExclamationTriangle,
  FaFilter,
} from "react-icons/fa";
import RequestCardSkeleton from "./RequestCardSkeleton";

// Memoized Donation Request Card Component
const DonationRequestCard = React.memo(({ request, index, urgencyLevel }) => {
  // Format the date and time
  const formattedDate = format(new Date(request.date), "MMM dd, yyyy");

  // Calculate days until donation
  const daysUntil = differenceInDays(new Date(request.date), new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
    >
      {/* Urgency indicator */}
      <div
        className={`h-1.5 w-full ${
          daysUntil <= 1
            ? "bg-red-500"
            : daysUntil <= 3
            ? "bg-amber-500"
            : "bg-green-500"
        }`}
      ></div>

      <div className="p-6">
        {/* Header with recipient info and blood type */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/20 rounded-lg p-3">
              <FaHeartbeat className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                {request.recipientName || request.patientName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Patient ID: {request.patientId || "N/A"}
              </p>
            </div>
          </div>

          {/* Blood type badge */}
          <div
            className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-bold ${
              request.bloodGroup === "O-"
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                : request.bloodGroup === "O+"
                ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                : request.bloodGroup.includes("A")
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : request.bloodGroup.includes("B")
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
            }`}
          >
            {request.bloodGroup}
          </div>
        </div>

        {/* Urgency level */}
        <div className="flex items-center mb-4">
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              daysUntil <= 1
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                : daysUntil <= 3
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-red-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {daysUntil <= 1 && (
              <FaExclamationTriangle className="mr-1 h-3 w-3" />
            )}
            {daysUntil <= 1
              ? "Urgent"
              : daysUntil <= 3
              ? "Medium Priority"
              : "Scheduled"}
          </div>

          {daysUntil >= 0 && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {daysUntil === 0
                ? "Today"
                : daysUntil === 1
                ? "Tomorrow"
                : `In ${daysUntil} days`}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FaMapMarkerAlt className="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-500" />
            <span>
              {request.recipientUpazila || request.upazila},{" "}
              {request.recipientDistrict || request.district}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FaHospital className="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-500" />
            <span className="truncate">
              {request.hospitalName ||
                request.recipientHospital ||
                "Hospital name not provided"}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-500" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FaClock className="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-500" />
            <span>{request.time}</span>
          </div>

          {request.contactNumber && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <FaPhone className="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-500" />
              <span>{request.contactNumber}</span>
            </div>
          )}
        </div>

        {/* Additional info */}
        {request.reason && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Reason:</span> {request.reason}
            </p>
          </div>
        )}

        {/* Action button */}
        <div className="mt-6 flex justify-end">
          <Link
            to={`/donation-request/${request._id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-gray-800 transition-all duration-300 group-hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

const DonationRequestsPublic = () => {
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  // Use your custom axios hook
  const axiosSecure = useAxios();

  // Fetch data using react-query
  const {
    data: requests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-donation-requests"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/donations?status=pending");
      return data.data;
    },
  });

  // Filter and sort requests
  const filteredRequests = React.useMemo(() => {
    let result = [...requests];

    // Apply blood group filter
    if (bloodGroupFilter !== "all") {
      result = result.filter((req) => req.bloodGroup === bloodGroupFilter);
    }

    // Apply urgency filter
    if (urgencyFilter !== "all") {
      result = result.filter((req) => {
        const daysUntil = differenceInDays(new Date(req.date), new Date());
        const urgency =
          daysUntil <= 1 ? "high" : daysUntil <= 3 ? "medium" : "low";
        return urgency === urgencyFilter;
      });
    }

    // Sort by urgency (high to low) and then by date (soonest first)
    result.sort((a, b) => {
      const daysA = differenceInDays(new Date(a.date), new Date());
      const daysB = differenceInDays(new Date(b.date), new Date());
      const urgencyA = daysA <= 1 ? "high" : daysA <= 3 ? "medium" : "low";
      const urgencyB = daysB <= 1 ? "high" : daysB <= 3 ? "medium" : "low";
      const urgencyOrder = { high: 0, medium: 1, low: 2 };

      if (urgencyOrder[urgencyA] !== urgencyOrder[urgencyB]) {
        return urgencyOrder[urgencyA] - urgencyOrder[urgencyB];
      }
      return daysA - daysB;
    });

    return result;
  }, [requests, bloodGroupFilter, urgencyFilter]);

  // Error state
  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl p-8 text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <FaExclamationTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-medium text-red-800 dark:text-red-200 mb-2">
            Failed to load requests
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">
            Please try again later or refresh the page
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-6"
        >
          <FaHeartbeat className="w-4 h-4 mr-2" />
          Donation Requests
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3"
        >
          Urgent Blood Donation Requests
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          These patients urgently need your help. Your donation can save lives.
        </motion.p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium mr-2">
            <FaFilter className="mr-2" />
            Filters:
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Blood Group Filter */}
            <div className="relative">
              <select
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
                className="appearance-none block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Blood Types</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  )
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Urgency Filter */}
            <div className="relative">
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="appearance-none block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Urgency Levels</option>
                <option value="high">Urgent</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Scheduled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {filteredRequests.length}{" "}
            {filteredRequests.length === 1 ? "request" : "requests"} found
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <RequestCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700"
        >
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
            <FaHeartbeat className="h-12 w-12 text-amber-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No Active Requests
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Currently there are no pending blood donation requests.
          </p>
          <button
            onClick={() => {
              setBloodGroupFilter("all");
              setUrgencyFilter("all");
            }}
            className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((request, index) => {
            // Calculate urgency level
            const daysUntil = differenceInDays(
              new Date(request.date),
              new Date()
            );
            const urgencyLevel =
              daysUntil <= 1 ? "high" : daysUntil <= 3 ? "medium" : "low";

            return (
              <DonationRequestCard
                key={request._id}
                request={request}
                index={index}
                urgencyLevel={urgencyLevel}
              />
            );
          })}
        </div>
      )}

      {/* Call to action section */}
      {!isLoading && filteredRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 rounded-xl p-8 border border-red-100 dark:border-red-800/30"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Ready to Save a Life?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              Join our community of donors and make a difference. Your donation
              can save up to three lives.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-md transition-all"
              >
                Become a Donor
              </Link>
              <Link
                to="/donor-resources"
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Learn About Donation
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DonationRequestsPublic;
