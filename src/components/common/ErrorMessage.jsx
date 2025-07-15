const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
      <div className="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Something went wrong</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorMessage;