import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import {
  Droplet,
  HeartPulse,
  CalendarCheck,
  Award,
  ShieldCheck,
  Users,
  Clock,
  Activity,
} from "lucide-react";

const FeaturedSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <HeartPulse className="w-8 h-8" />,
      title: "Life-Saving Impact",
      description:
        "Each donation can save up to 3 lives in emergency situations.",
      stats: "10,000+ lives saved",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Growing Community",
      description:
        "Join our network of 50,000+ registered donors across the country.",
      stats: "500+ new donors weekly",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <CalendarCheck className="w-8 h-8" />,
      title: "Easy Scheduling",
      description:
        "Book appointments at 200+ partner centers with our mobile app.",
      stats: "95% satisfaction rate",
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Safety Certified",
      description:
        "All centers follow WHO safety protocols with sterile equipment.",
      stats: "100% safety record",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Process",
      description:
        "Complete your donation in just 30-45 minutes including screening.",
      stats: "Under 10 min donation",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Health Benefits",
      description:
        "Regular donation reduces risk of heart disease and burns calories.",
      stats: "650 calories per donation",
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-amber-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-6"
          >
            <Droplet className="w-4 h-4 mr-2" />
            Why Choose Donorly
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-5"
          >
            The{" "}
            <span className="text-red-600 dark:text-red-500">Most Trusted</span>{" "}
            Blood Donation Platform
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300"
          >
            We connect donors with those in need through innovative technology
            and a compassionate community.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl ${feature.bgColor} border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div
                className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}
              >
                <div className={feature.color}>{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {feature.description}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {feature.stats}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <button className="inline-flex items-center px-8 py-4 rounded-full text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg">
            <HeartPulse className="w-5 h-5 mr-3" />
            Join Our Donor Community
          </button>
        </motion.div>
      </div>

      {/* Blood drop pattern */}
      <div className="absolute -bottom-40 -right-40 w-96 h-96 opacity-5 dark:opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M45.2,-58.6C57.8,-49.3,66.5,-33.9,68.8,-17.7C71.1,-1.5,67,15.5,57.2,29.5C47.4,43.5,31.8,54.5,13.9,62.7C-4.1,70.9,-24.3,76.3,-39.3,68.7C-54.3,61.1,-64,40.5,-68.1,18.9C-72.2,-2.7,-70.6,-25.3,-59.7,-40.7C-48.8,-56.1,-28.6,-64.3,-9.3,-59.3C10,-54.3,20,-36.1,45.2,-58.6Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
    </section>
  );
};

export default FeaturedSection;
