import React from "react";
import useTitle from "../../hooks/useTitle";
import { Link } from "react-router";
import { FaHeartbeat, FaHome } from "react-icons/fa";
import { motion } from "motion/react";

const Error = () => {
  useTitle("Error | LifeFlow - Blood Donation");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden border border-red-100">
        {/* Header */}
        <div className="bg-red-600 py-6 px-8 flex items-center justify-center">
          <FaHeartbeat className="text-white text-4xl mr-3" />
          <h1 className="text-3xl font-bold text-white">LifeFlow</h1>
        </div>

        {/* Error Content */}
        <div className="p-8 md:p-10">
          <div className="text-red-500 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            We couldn't find the page you're looking for. This might be because:
          </p>

          <ul className="text-left max-w-md mx-auto text-gray-600 space-y-2 mb-8">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              The page has moved or no longer exists
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              You entered an incorrect address
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              There's a temporary server issue
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-300"
            >
              <FaHome className="mr-2" />
              Return Home
            </Link>
            <a
              href="mailto:support@lifeflow.org"
              className="flex items-center justify-center px-6 py-3 border border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-lg transition duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 px-8 py-4 text-center text-gray-500 text-sm">
          <p>
            If this error persists, please contact our support team at{" "}
            <a
              href="mailto:support@lifeflow.org"
              className="text-red-600 hover:underline"
            >
              support@lifeflow.org
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Error;
