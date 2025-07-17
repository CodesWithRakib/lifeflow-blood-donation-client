// ContactUs.jsx
import { useForm, FormProvider } from "react-hook-form";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import ContactForm from "../../components/form/ContactForm";
import useAxios from "../../hooks/useAxios";

const ContactUs = () => {
  const methods = useForm();
  const axiosSecure = useAxios();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = methods;

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const onSubmit = async (data) => {
    try {
      const response = await axiosSecure.post("/contact", data);
      if (response.status === 200) {
        toast.success("Message sent successfully!");
        reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 bg-white dark:bg-gray-900"
      ref={ref}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get In <span className="text-red-600 dark:text-red-500">Touch</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Have questions or need assistance? Our team is here to help you with
            any inquiries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
              Send us a message
            </h3>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ContactForm
                  id="name"
                  label="Full Name"
                  placeholder="Your name"
                  required
                />
                <ContactForm
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  required
                  pattern={{
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  }}
                />
                <ContactForm
                  id="phone"
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="+1 (___) ___-____"
                />

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register("message", {
                      required: "Message is required",
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="How can we help you?"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-colors duration-300 shadow-md font-medium"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </FormProvider>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
                Contact Information
              </h3>
              <div className="space-y-6">
                <ContactInfo
                  icon={<Phone className="w-5 h-5" />}
                  title="Emergency Hotline"
                  detail="+1 (123) 456-7890"
                  subtitle="24/7 available"
                />
                <ContactInfo
                  icon={<Mail className="w-5 h-5" />}
                  title="Email Us"
                  detail="support@lifeflow.com"
                  subtitle="Typically replies within 24 hours"
                />
                <ContactInfo
                  icon={<MapPin className="w-5 h-5" />}
                  title="Our Headquarters"
                  detail="123 Blood Drive Ave, Suite 100"
                  subtitle="New York, NY 10001"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Operating Hours
              </h3>
              <ul className="space-y-3">
                <OperatingHour day="Monday - Friday" time="8:00 AM - 8:00 PM" />
                <OperatingHour day="Saturday" time="9:00 AM - 5:00 PM" />
                <OperatingHour day="Sunday" time="Emergency Only" />
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ContactInfo = ({ icon, title, detail, subtitle }) => (
  <div className="flex items-start space-x-4">
    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
      {icon}
    </div>
    <div>
      <h4 className="font-medium text-gray-700 dark:text-gray-300">{title}</h4>
      <p className="text-lg font-semibold text-gray-900 dark:text-white">
        {detail}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {subtitle}
      </p>
    </div>
  </div>
);

const OperatingHour = ({ day, time }) => (
  <li className="flex justify-between">
    <span className="text-gray-600 dark:text-gray-300">{day}</span>
    <span className="font-medium text-gray-900 dark:text-white">{time}</span>
  </li>
);

export default ContactUs;
