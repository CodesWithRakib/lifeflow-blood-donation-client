import React, { useMemo } from "react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import {
  Droplet,
  HeartPulse,
  CalendarCheck,
  ShieldCheck,
  Users,
  Clock,
  Activity,
  Star,
  Quote,
  TrendingUp,
  Award,
} from "lucide-react";

// Memoized Feature Card Component
const FeatureCard = React.memo(({ feature, index, inView }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: index * 0.1,
          },
        },
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      className={`p-6 rounded-xl ${feature.bgColor} border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMEg0MFY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBMNDAgNDBNNDAgMEwwIDQwIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')]"></div>
      </div>

      <div className="relative z-10">
        <motion.div
          className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color} ${feature.bgColor}`}
          whileHover={{
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
            transition: { duration: 0.5 },
          }}
        >
          <Icon className="w-8 h-8" />
        </motion.div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {feature.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-3">
          {feature.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {feature.stats}
          </p>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
            className="h-1 bg-gradient-to-r from-transparent to-current rounded-full"
            style={{
              maxWidth: "60px",
              color: feature.color.replace("text-", ""),
            }}
          />
        </div>
      </div>
    </motion.div>
  );
});

// Memoized Testimonial Component
const TestimonialCard = React.memo(({ inView }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay: 0.7, duration: 0.6 }}
    className="bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-red-100 dark:border-red-800/30 shadow-sm"
  >
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-800/30 flex items-center justify-center">
          <Quote className="w-6 h-6 text-red-500" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        <p className="text-gray-700 dark:text-gray-300 italic mb-3">
          "LifeFlow made it so easy to donate blood. The entire process took
          less than an hour, and I received updates when my donation was used to
          help someone in need."
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Michael R.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Regular Donor
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));

// Memoized Stats Counter Component
const StatsCounter = React.memo(({ inView }) => {
  const stats = [
    { value: "50,000+", label: "Active Donors", icon: Users },
    { value: "10,000+", label: "Lives Saved", icon: HeartPulse },
    { value: "200+", label: "Partner Centers", icon: ShieldCheck },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-center"
          >
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-red-500" />
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                delay: 0.6 + index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
            >
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </motion.div>

            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {stat.label}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
});

const FeaturedSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Memoize features array to prevent unnecessary re-renders
  const features = useMemo(
    () => [
      {
        icon: HeartPulse,
        title: "Life-Saving Impact",
        description:
          "Each donation can save up to 3 lives in emergency situations.",
        stats: "10,000+ lives saved",
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-900/20",
      },
      {
        icon: Users,
        title: "Growing Community",
        description:
          "Join our network of 50,000+ registered donors across the country.",
        stats: "500+ new donors weekly",
        color: "text-yellow-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      },
      {
        icon: CalendarCheck,
        title: "Easy Scheduling",
        description:
          "Book appointments at 200+ partner centers with our mobile app.",
        stats: "95% satisfaction rate",
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
      },
      {
        icon: ShieldCheck,
        title: "Safety Certified",
        description:
          "All centers follow WHO safety protocols with sterile equipment.",
        stats: "100% safety record",
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-900/20",
      },
      {
        icon: Clock,
        title: "Quick Process",
        description:
          "Complete your donation in just 30–45 minutes including screening.",
        stats: "Under 10 min donation",
        color: "text-gray-700",
        bgColor: "bg-gray-50 dark:bg-gray-800/20",
      },
      {
        icon: Activity,
        title: "Health Benefits",
        description:
          "Regular donation reduces risk of heart disease and burns calories.",
        stats: "650 calories per donation",
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-900/20",
      },
    ],
    []
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <section
      className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
      aria-labelledby="featured-heading"
    >
      {/* Decorative blur blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5 },
              },
            }}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-6"
          >
            <Droplet className="w-4 h-4 mr-2" />
            Why Choose LifeFlow
          </motion.div>

          <motion.h2
            id="featured-heading"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.1 },
              },
            }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-5"
          >
            The{" "}
            <span className="text-red-600 dark:text-red-500">Most Trusted</span>{" "}
            Blood Donation Platform
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.2 },
              },
            }}
            className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300"
          >
            We connect donors with those in need through innovative technology
            and a compassionate community.
          </motion.p>
        </motion.div>

        {/* Stats Counter */}
        <StatsCounter inView={inView} />

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              inView={inView}
            />
          ))}
        </motion.div>

        {/* Testimonial */}
        <TestimonialCard inView={inView} />

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 rounded-full text-white font-poppins bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
            aria-label="Join Our Donor Community"
          >
            <HeartPulse className="w-5 h-5 mr-3" />
            Join Our Donor Community
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative SVG shape */}
      <div className="absolute -bottom-40 -right-40 w-96 h-96 opacity-5 dark:opacity-10">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
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
