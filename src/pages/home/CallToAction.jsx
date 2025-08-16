import React from "react";
import { motion } from "motion/react";
import { Heart, ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Save Lives?
            </h2>
            <p className="text-xl text-red-100 mb-10">
              Join our community of heroes. One donation can save up to three
              lives.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-8 py-4 bg-white text-red-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
              >
                <Heart className="mr-2 w-5 h-5" />
                Become a Donor
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
              >
                Find Donation Center
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </div>

            <p className="mt-8 text-red-200 text-sm">
              Already a donor?{" "}
              <a href="#" className="text-white font-medium underline">
                Log in to your account
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
