import React from "react";

const RequestCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg p-3 animate-pulse">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
          <div className="ml-4 flex-1 space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default RequestCardSkeleton;
