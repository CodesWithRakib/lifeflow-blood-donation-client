import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import {
  Droplet,
  HeartPulse,
  CalendarCheck,
  Award,
  ShieldCheck,
} from "lucide-react";
import FeatureCard from "../../components/home/FeatureCard";

const features = [
  {
    icon: <HeartPulse className="w-10 h-10" />,
    title: "Save Lives",
    description:
      "Each donation can help up to 3 people in need of blood transfusions.",
    color: "text-red-500",
  },
  {
    icon: <CalendarCheck className="w-10 h-10" />,
    title: "Easy Scheduling",
    description:
      "Book appointments at nearby blood banks with our simple scheduling system.",
    color: "text-amber-500",
  },
  {
    icon: <Droplet className="w-10 h-10" />,
    title: "Track Donations",
    description:
      "Monitor your donation history and see the impact you've made.",
    color: "text-blue-500",
  },
  {
    icon: <ShieldCheck className="w-10 h-10" />,
    title: "Safety First",
    description:
      "All centers follow strict safety protocols for your protection.",
    color: "text-emerald-500",
  },
  {
    icon: <Award className="w-10 h-10" />,
    title: "Earn Badges",
    description: "Get recognized for your donations with our reward system.",
    color: "text-purple-500",
  },
];

const FeaturedSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 bg-red-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-amber-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mb-4">
            <Droplet className="w-4 h-4 mr-2" />
            Why Donate With Us
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Transforming Donations Into{" "}
            <span className="text-red-600 dark:text-red-500">Lifesaving</span>{" "}
            Actions
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Our platform makes blood donation simple, rewarding, and impactful.
            Join thousands of donors making a difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.slice(0, 3).map((feature, index) => (
            <FeatureCard key={feature.title} index={index} {...feature} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 lg:w-4/5 lg:mx-auto"
        >
          {features.slice(3).map((feature, index) => (
            <FeatureCard key={feature.title} index={index + 3} {...feature} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-colors duration-300 shadow-lg font-medium">
            <HeartPulse className="w-5 h-5 mr-2" />
            Become a Regular Donor
          </div>
        </motion.div>
      </div>

      {/* Blood drop pattern */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-10">
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
