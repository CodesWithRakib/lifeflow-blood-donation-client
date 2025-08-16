import React from "react";
import { motion } from "motion/react";
import { Droplet } from "lucide-react";

const BloodTypes = () => {
  const bloodTypes = [
    {
      type: "O+",
      description: "Universal donor for red blood cells",
      canDonateTo: ["O+", "A+", "B+", "AB+"],
      canReceiveFrom: ["O+", "O-"],
      demand: "High",
      rarity: "38%",
    },
    {
      type: "O-",
      description: "Universal donor for all blood types",
      canDonateTo: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
      canReceiveFrom: ["O-"],
      demand: "Critical",
      rarity: "7%",
    },
    {
      type: "A+",
      description: "Can donate to A+ and AB+",
      canDonateTo: ["A+", "AB+"],
      canReceiveFrom: ["A+", "A-", "O+", "O-"],
      demand: "High",
      rarity: "34%",
    },
    {
      type: "A-",
      description: "Can donate to A+, A-, AB+, AB-",
      canDonateTo: ["A+", "A-", "AB+", "AB-"],
      canReceiveFrom: ["A-", "O-"],
      demand: "Medium",
      rarity: "6%",
    },
    {
      type: "B+",
      description: "Can donate to B+ and AB+",
      canDonateTo: ["B+", "AB+"],
      canReceiveFrom: ["B+", "B-", "O+", "O-"],
      demand: "High",
      rarity: "9%",
    },
    {
      type: "B-",
      description: "Can donate to B+, B-, AB+, AB-",
      canDonateTo: ["B+", "B-", "AB+", "AB-"],
      canReceiveFrom: ["B-", "O-"],
      demand: "Medium",
      rarity: "2%",
    },
    {
      type: "AB+",
      description: "Universal recipient for red blood cells",
      canDonateTo: ["AB+"],
      canReceiveFrom: ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
      demand: "Medium",
      rarity: "3%",
    },
    {
      type: "AB-",
      description: "Universal plasma donor",
      canDonateTo: ["AB+", "AB-"],
      canReceiveFrom: ["AB-", "A-", "B-", "O-"],
      demand: "Low",
      rarity: "1%",
    },
  ];

  const getDemandColor = (demand) => {
    switch (demand) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blood Types Information
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Understanding blood types helps ensure patients receive compatible
            donations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bloodTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${getDemandColor(
                    type.demand
                  )}`}
                >
                  {type.type}
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${getDemandColor(
                        type.demand
                      )} mr-2`}
                    ></span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {type.demand} Demand
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {type.rarity} of population
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {type.description}
              </p>

              <div className="text-xs">
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Can donate to:
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {type.canDonateTo.map((recipient, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                    >
                      {recipient}
                    </span>
                  ))}
                </div>

                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Can receive from:
                </div>
                <div className="flex flex-wrap gap-1">
                  {type.canReceiveFrom.map((donor, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded"
                    >
                      {donor}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BloodTypes;
