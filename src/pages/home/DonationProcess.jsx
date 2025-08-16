import React from "react";
import { motion } from "motion/react";
import {
  UserCheck,
  CalendarCheck,
  Droplet,
  Heart,
  ShieldCheck,
  Clock,
} from "lucide-react";

const DonationProcess = () => {
  const steps = [
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Registration",
      description:
        "Sign up as a donor with your basic information and contact details.",
    },
    {
      icon: <CalendarCheck className="w-8 h-8" />,
      title: "Schedule Appointment",
      description:
        "Book a convenient time slot at your nearest donation center.",
    },
    {
      icon: <Droplet className="w-8 h-8" />,
      title: "Donation Process",
      description:
        "The actual donation takes about 10 minutes with our sterile equipment.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Recovery",
      description: "Rest for 15 minutes with refreshments before leaving.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Health Check",
      description: "Receive a free mini health checkup after donation.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save Lives",
      description:
        "Your donation can save up to three lives in emergency situations.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple Donation Process
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Donating blood is quick, easy, and safe. Here's how it works:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 mr-4">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonationProcess;
