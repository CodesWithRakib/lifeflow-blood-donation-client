import React from "react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Emily Rodriguez",
      role: "Regular Donor",
      content:
        "Donating blood is one of the most rewarding experiences. The staff at LifeFlow makes the process so comfortable and easy. I've been donating every 56 days for the past 5 years!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    {
      name: "Dr. James Wilson",
      role: "Hematologist",
      content:
        "LifeFlow has revolutionized blood donation management in our region. Their efficient system ensures we always have the right blood types available for our patients.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/40.jpg",
    },
    {
      name: "Jennifer Thompson",
      role: "Blood Recipient",
      content:
        "I needed blood after my surgery. Thanks to LifeFlow's network of donors, I received the blood I needed quickly. I'm forever grateful to the anonymous donors who saved my life.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/35.jpg",
    },
  ];

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What People Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from our donors, medical partners, and recipients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">{renderStars(testimonial.rating)}</div>

              <div className="relative">
                <Quote className="absolute top-0 left-0 text-red-200 dark:text-red-800/30 w-8 h-8" />
                <p className="text-gray-600 dark:text-gray-300 italic pl-6">
                  {testimonial.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
