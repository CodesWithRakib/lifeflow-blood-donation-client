import { Link } from "react-router";
import { Droplet, HeartHandshake, Search } from "lucide-react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const blobVariants = {
  animate: {
    x: [0, 30, -20, 0],
    y: [0, -50, 20, 0],
    scale: [1, 1.1, 0.9, 1],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const Banner = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    "1 donation can save up to 3 lives",
    "Only takes about 10 minutes",
    "Helps maintain your own health",
    "Free health checkup included",
  ];

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-br from-red-600 to-red-700 dark:from-red-800 dark:to-red-900 text-white overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPjxwYXRoIGQ9Ik0wIDBMNDAgNDBNNDAgMEwwIDQwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Content */}
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants}>
              <Droplet className="h-12 w-12 mx-auto lg:mx-0 mb-4 text-red-200" />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              variants={itemVariants}
            >
              Save Lives With Your{" "}
              <span className="text-amber-300">Blood Donation</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-red-100 max-w-lg mb-8 mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Join our community of life-savers or find the donors you need.
              Every donation makes a difference.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <Link
                to="/register"
                className="bg-white hover:bg-gray-50 text-red-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
                <HeartHandshake className="h-5 w-5" />
                Join as a Donor
              </Link>
              <Link
                to="/search-donors"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
                <Search className="h-5 w-5" />
                Search Donors
              </Link>
            </motion.div>
          </div>

          {/* Illustration - Visible on lg screens and up */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Floating blobs */}
              <motion.div
                className="absolute -top-8 -left-8 w-32 h-32 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                variants={blobVariants}
                animate="animate"
              />
              <motion.div
                className="absolute -bottom-8 -right-8 w-32 h-32 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                variants={blobVariants}
                animate="animate"
                initial={{ x: 0, y: 0, scale: 1 }}
                transition={{ ...blobVariants.animate.transition, delay: 3 }}
              />
              <motion.div
                className="absolute top-16 -right-8 w-32 h-32 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                variants={blobVariants}
                animate="animate"
                initial={{ x: 0, y: 0, scale: 1 }}
                transition={{ ...blobVariants.animate.transition, delay: 6 }}
              />

              {/* Info card */}
              <motion.div
                className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: 0.4,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <Droplet className="h-16 w-16 text-red-200 mb-4" />
                  <h3 className="text-xl font-bold mb-4">Why Donate Blood?</h3>
                  <ul className="space-y-3 text-red-100 text-left w-full">
                    {benefits.map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ x: 20, opacity: 0 }}
                        animate={inView ? { x: 0, opacity: 1 } : {}}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <span className="text-amber-300 mt-1">•</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile-friendly illustration for smaller screens */}
      <div className="lg:hidden px-4 pb-12">
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex flex-col items-center text-center">
            <Droplet className="h-12 w-12 text-red-200 mb-3" />
            <h3 className="text-lg font-bold mb-3">Why Donate Blood?</h3>
            <ul className="space-y-2 text-red-100 text-sm text-left w-full">
              {benefits.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <span className="text-amber-300">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-current text-white dark:text-gray-900"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-current text-white dark:text-gray-900"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-current text-white dark:text-gray-900"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Banner;
