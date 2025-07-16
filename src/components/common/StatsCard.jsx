import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendPositive = true,
  loading = false,
  delay = 0,
}) => {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        delay: delay * 0.1,
      },
    },
  };

  const TrendIcon = trendPositive ? ArrowUpRight : ArrowDownRight;
  const trendColor = trendPositive
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
  const trendBgColor = trendPositive
    ? "bg-green-50 dark:bg-green-900/20"
    : "bg-red-50 dark:bg-red-900/20";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md overflow-hidden"
    >
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white dark:to-gray-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              value
            )}
          </h3>
        </div>
        <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 shadow-inner group-hover:shadow-md transition-shadow">
          {icon}
        </div>
      </div>

      {trend && (
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + delay * 0.1 }}
          className={`mt-4 inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${trendBgColor} ${trendColor}`}
        >
          <TrendIcon className="h-3 w-3 mr-1" />
          <span>{trend}</span>
        </motion.div>
      )}

      {/* Optional: Add a subtle border on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-200 dark:group-hover:border-amber-800 rounded-xl pointer-events-none transition-all duration-300" />
    </motion.div>
  );
};

export default StatsCard;
