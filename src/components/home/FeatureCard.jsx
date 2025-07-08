import { useInView } from "react-intersection-observer";
import { motion } from "motion/react";

const FeatureCard = ({ icon, title, description, color, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div
        className={`mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center ${color} bg-opacity-10 dark:bg-opacity-20`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
