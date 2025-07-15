import React from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size = "lg", message = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "linear",
        }}
        className={`text-amber-500 dark:text-amber-400 ${sizeClasses[size]}`}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className={`text-gray-600 dark:text-gray-300 ${textSizes[size]} font-medium`}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default LoadingSpinner;
