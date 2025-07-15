import React from "react";
import { motion } from "motion/react";

const ParticleWaveSpinner = ({ message = "Loading..." }) => {
  const particles = Array(12).fill(0);

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative w-32 h-32">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-amber-500 rounded-full"
            initial={{
              x: 0,
              y: 0,
              opacity: 0.7,
            }}
            animate={{
              x: Math.sin((i * 30 * Math.PI) / 180) * 40,
              y: Math.cos((i * 30 * Math.PI) / 180) * 40,
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.05,
              ease: "easeInOut",
            }}
            style={{
              left: "50%",
              top: "50%",
              marginLeft: -6,
              marginTop: -6,
            }}
          />
        ))}
        <motion.div
          className="absolute w-8 h-8 bg-amber-600 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            marginLeft: -16,
            marginTop: -16,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 dark:text-gray-300 text-sm font-medium"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default ParticleWaveSpinner;
