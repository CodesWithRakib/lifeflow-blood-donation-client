import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendPositive = true,
  loading = false,
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
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md"
    >
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
        <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 shadow-inner">
          {icon}
        </div>
      </div>

      {trend && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`mt-4 inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${trendBgColor} ${trendColor}`}
        >
          <TrendIcon className="h-3 w-3 mr-1" />
          <span>{trend}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatsCard;
