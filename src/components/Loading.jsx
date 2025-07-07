import React from "react";
import { Loader } from "lucide-react";
import { motion } from "motion/react";

const Loading = () => {
  return (
    <section
      className="flex flex-col items-center justify-center h-[100vh] text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="text-amber-600 dark:text-amber-400"
      >
        <Loader className="w-16 h-16" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-4 text-gray-600 dark:text-gray-300 text-sm"
      >
        Please wait while we load your data...
      </motion.p>
    </section>
  );
};

export default Loading;
