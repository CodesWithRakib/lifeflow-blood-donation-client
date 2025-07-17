import React from "react";
import useTitle from "../../hooks/useTitle";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import useAxios from "../../hooks/useAxios";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

const MyDonations = () => {
  useTitle("My Donations | LifeFlow - Blood Donation");
  const axiosSecure = useAxios();

  // Fetch user's donations
  const {
    data: donations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myDonations"],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get("/donations/my-donations");
        if (!data.success) {
          throw new Error(data.message || "Failed to load donations");
        }
        return data?.data;
      } catch (err) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch donations"
        );
      }
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage
          message={error.message}
          onRetry={() => queryClient.invalidateQueries(["myDonations"])}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Donation History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {donations?.length || 0}{" "}
            {donations?.length === 1 ? "donation" : "donations"} recorded
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <div className="relative">
            <select
              className="block w-full sm:w-48 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              defaultValue="all"
            >
              <option value="all">All Donations</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {donations?.length === 0 ? (
        <EmptyState
          title="No donations yet"
          description="Your donation history will appear here once you make your first donation."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
          }
          action={
            <button
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
              onClick={() => (window.location.href = "/donation-requests")}
            >
              Find Donation Requests
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {donations?.map((donation) => (
            <div
              key={donation._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-700/50"
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {donation.donor?.avatar && (
                        <img
                          src={donation.donor.avatar}
                          alt="Donor"
                          className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Donation for {donation.recipientName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {donation.hospitalName} • {donation.recipientUpazila},{" "}
                          {donation.recipientDistrict}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {format(new Date(donation.date), "PPP")}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {donation.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        Blood Group:{" "}
                        <span className="font-medium ml-1">
                          {donation.bloodGroup}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Status:{" "}
                        <span className="font-medium ml-1 capitalize">
                          {donation.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        donation.status === "done"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                      }`}
                    >
                      {donation.status === "done" ? "Completed" : "Scheduled"}
                    </span>
                  </div>
                </div>

                {donation.status === "done" ? (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20 flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Successfully donated on{" "}
                        {format(
                          new Date(donation.donatedAt),
                          "PPP 'at' h:mm a"
                        )}
                        . Thank you for saving lives!
                      </p>
                      {donation.message && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 italic">
                          "{donation.message}"
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20 flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Your donation is scheduled. Please arrive at{" "}
                        {donation.time} on{" "}
                        {format(new Date(donation.date), "PPP")}.
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Location: {donation.hospitalName},{" "}
                        {donation.fullAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
