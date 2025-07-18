import React from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  size = "lg",
  message = "Loading life-saving data...",
  variant = "primary",
  fullScreen = true,
}) => {
  // Size configuration
  const sizeClasses = {
    sm: { icon: "w-6 h-6", text: "text-xs" },
    md: { icon: "w-10 h-10", text: "text-sm" },
    lg: { icon: "w-16 h-16", text: "text-base" },
    xl: { icon: "w-20 h-20", text: "text-lg" },
  };

  // Color variants
  const variants = {
    primary: {
      icon: "text-red-600",
      text: "text-gray-700",
    },
    secondary: {
      icon: "text-white",
      text: "text-gray-100",
    },
    dark: {
      icon: "text-gray-800",
      text: "text-gray-600",
    },
    light: {
      icon: "text-red-300",
      text: "text-gray-400",
    },
  };

  // Container classes
  const containerClasses = fullScreen
    ? "flex flex-col items-center justify-center h-screen w-full gap-3"
    : "flex flex-col items-center justify-center gap-3 py-8";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Animated spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "linear",
        }}
        className={`${variants[variant].icon} ${sizeClasses[size].icon}`}
      >
        <Loader2
          className="w-full h-full"
          strokeWidth={size === "xl" ? 1.5 : 2}
        />
      </motion.div>

      {/* Loading text with subtle animation */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className={`${variants[variant].text} ${sizeClasses[size].text} font-medium tracking-wide`}
      >
        {message}
      </motion.p>

      {/* Optional progress indicator for longer waits */}
      {fullScreen && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "40%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-1 bg-red-100 rounded-full mt-4 max-w-xs"
        />
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
