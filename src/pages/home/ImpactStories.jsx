import React from "react";
import { motion } from "motion/react";
import { Heart, Quote } from "lucide-react";

const ImpactStories = () => {
  const stories = [
    {
      name: "Sarah Johnson",
      age: 32,
      story:
        "After a complicated childbirth, I needed multiple blood transfusions. Thanks to generous donors, I survived and am now enjoying life with my newborn daughter.",
      impact: "4 units of blood saved her life",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      name: "Michael Chen",
      age: 8,
      story:
        "When I was diagnosed with leukemia, I needed regular blood transfusions during my treatment. Blood donors gave me a second chance at life.",
      impact: "Over 20 transfusions during treatment",
      image: "https://randomuser.me/api/portraits/boys/8.jpg",
    },
    {
      name: "Robert Williams",
      age: 45,
      story:
        "After a serious car accident, I lost a lot of blood. The blood I received at the hospital saved my life. I'm now a regular donor myself.",
      impact: "6 units of blood in emergency surgery",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Real Stories, Real Impact
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meet some of the lives saved by blood donation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-r from-red-500 to-amber-500 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-medium">Life Saved</div>
                  <div className="text-2xl font-bold">
                    {story.name}, {story.age}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start mb-4">
                  <Quote className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    {story.story}
                  </p>
                </div>

                <div className="flex items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <Heart className="text-red-500" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {story.impact}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
            Read More Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImpactStories;
