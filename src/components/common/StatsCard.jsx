import React from "react";

const StatsCard = ({ title, value, icon, trend, trendPositive = true }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {value}
          </h3>
        </div>
        <div className="p-3 rounded-full bg-amber-50 dark:bg-gray-700 text-amber-600 dark:text-amber-400">
          {icon}
        </div>
      </div>
      {trend && (
        <div
          className={`mt-4 flex items-center text-sm ${
            trendPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
