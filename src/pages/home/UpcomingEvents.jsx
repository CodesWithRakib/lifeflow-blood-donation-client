import React from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Clock, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const handleEvents = () => {
    window.location.href = "/register";
  };
  const events = [
    {
      title: "Community Blood Drive",
      date: "2023-06-15",
      time: "9:00 AM - 3:00 PM",
      location: "City Community Center",
      address: "123 Main St, Anytown",
      capacity: 100,
      registered: 65,
      description:
        "Join us for our monthly community blood drive. All donors receive a free health screening and refreshments.",
    },
    {
      title: "Corporate Donation Day",
      date: "2023-06-22",
      time: "10:00 AM - 4:00 PM",
      location: "Tech Park Office Building",
      address: "456 Innovation Ave, Tech City",
      capacity: 80,
      registered: 42,
      description:
        "Special blood drive for corporate employees. Walk-ins welcome, appointments preferred.",
    },
    {
      title: "Emergency Blood Drive",
      date: "2023-06-28",
      time: "8:00 AM - 6:00 PM",
      location: "Central Hospital",
      address: "789 Health Blvd, Medical District",
      capacity: 150,
      registered: 120,
      description:
        "Emergency blood drive due to critical shortage. All blood types urgently needed.",
    },
  ];

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Blood Drives
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Participate in our upcoming events and help save lives
          </p>
        </div>

        <div className="space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="flex items-start mb-3">
                    <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-3 mr-4">
                      <Calendar className="text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 ml-16">
                    {event.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 ml-16">
                    <div className="flex items-center mr-4">
                      <Users className="w-4 h-4 mr-1" />
                      <span>
                        {event.registered}/{event.capacity} registered
                      </span>
                    </div>
                    <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (event.registered / event.capacity) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-6">
                  <button
                    onClick={() => navigate("/register")}
                    className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Register Now
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={handleEvents}
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
