import { motion } from "motion/react";
import { HeartHandshake, Users, Droplet } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About <span className="text-red-600">Donorly</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Connecting blood donors with recipients to save lives since 2023
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          {
            icon: <HeartHandshake className="w-10 h-10 text-red-500" />,
            title: "Our Mission",
            description:
              "To create a reliable network of blood donors and make blood accessible to everyone in need.",
          },
          {
            icon: <Users className="w-10 h-10 text-red-500" />,
            title: "Our Community",
            description:
              "Over 10,000 registered donors helping save lives across the country.",
          },
          {
            icon: <Droplet className="w-10 h-10 text-red-500" />,
            title: "Our Impact",
            description:
              "Facilitated more than 5,000 successful blood donations to date.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Donorly was founded in 2023 by a group of healthcare professionals and
          tech enthusiasts who witnessed the challenges in blood donation
          systems firsthand.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          What started as a small initiative to connect donors in our local
          community has now grown into a nationwide platform helping thousands
          of people access life-saving blood donations when they need it most.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
