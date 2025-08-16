// ContactUs.jsx
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  User,
  AtSign,
  FileText,
  Building,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/useAxios";

// Form Input Component
const FormInput = ({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  validation = {},
  icon,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
      >
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-600 focus:ring-red-500"
        } focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  );
};

// Form Textarea Component
const FormTextarea = ({
  id,
  label,
  placeholder,
  required = false,
  validation = {},
  icon,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
      >
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        rows={4}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-600 focus:ring-red-500"
        } focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  );
};

// Form Select Component
const FormSelect = ({ id, label, options, required = false, icon, error }) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
      >
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-600 focus:ring-red-500"
        } focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  );
};

// Contact Info Card Component
const ContactInfoCard = React.memo(
  ({ icon, title, detail, subtitle, link, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">
          {title}
        </h4>
        {link ? (
          <a
            href={link}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            {detail}
          </a>
        ) : (
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {detail}
          </p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      </div>
    </motion.div>
  )
);

// Operating Hour Component
const OperatingHour = React.memo(({ day, time, isLast = false }) => (
  <li
    className={`flex justify-between py-2 ${
      !isLast ? "border-b border-gray-200 dark:border-gray-700" : ""
    }`}
  >
    <span className="text-gray-600 dark:text-gray-300">{day}</span>
    <span
      className={`font-medium ${
        time === "Emergency Only"
          ? "text-red-500"
          : "text-gray-900 dark:text-white"
      }`}
    >
      {time}
    </span>
  </li>
));

// FAQ Item Component
const FAQItem = React.memo(({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-3">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900 dark:text-white">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-2 text-gray-600 dark:text-gray-400 text-sm">
          {answer}
        </div>
      </motion.div>
    </div>
  );
});

const ContactUs = () => {
  const methods = useForm();
  const axiosSecure = useAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = methods;

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const contactReasons = [
    { value: "general", label: "General Inquiry" },
    { value: "donation", label: "Blood Donation" },
    { value: "volunteer", label: "Volunteering" },
    { value: "partnership", label: "Partnership" },
    { value: "technical", label: "Technical Support" },
    { value: "feedback", label: "Feedback" },
  ];

  const contactFaqs = [
    {
      question: "How quickly will I receive a response?",
      answer:
        "We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please call our emergency hotline.",
    },
    {
      question: "Can I schedule a blood donation through this form?",
      answer:
        "For scheduling donations, please use our appointment system or call our donation hotline directly for faster service.",
    },
    {
      question: "Do you offer volunteer opportunities?",
      answer:
        "Yes, we have various volunteer opportunities available. Please select 'Volunteering' as your contact reason and we'll send you information.",
    },
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axiosSecure.post("/contact", data);
      if (response.status === 200) {
        toast.success("Message sent successfully!");
        reset();
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
      ref={ref}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-red-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-6">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Us
          </div>
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
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-red-500" />
              Send us a message
            </h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Message Sent Successfully!
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thank you for contacting us. We'll get back to you within
                  24-48 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormInput
                        id="name"
                        label="Full Name"
                        placeholder="Your name"
                        required
                        icon={<User className="w-4 h-4" />}
                        error={errors.name}
                        {...register("name", {
                          required: "Name is required",
                        })}
                      />
                    </div>
                    <div>
                      <FormInput
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="your@email.com"
                        required
                        icon={<AtSign className="w-4 h-4" />}
                        error={errors.email}
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <FormInput
                      id="phone"
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (___) ___-____"
                      icon={<Phone className="w-4 h-4" />}
                      error={errors.phone}
                      {...register("phone")}
                    />
                  </div>

                  <div>
                    <FormSelect
                      id="reason"
                      label="Reason for Contact"
                      options={contactReasons}
                      required
                      icon={<FileText className="w-4 h-4" />}
                      error={errors.reason}
                      {...register("reason", {
                        required: "Reason is required",
                      })}
                    />
                  </div>

                  <div>
                    <FormInput
                      id="subject"
                      label="Subject"
                      placeholder="How can we help you?"
                      required
                      icon={<MessageCircle className="w-4 h-4" />}
                      error={errors.subject}
                      {...register("subject", {
                        required: "Subject is required",
                      })}
                    />
                  </div>

                  <div>
                    <FormTextarea
                      id="message"
                      label="Your Message"
                      placeholder="Please provide details about your inquiry..."
                      required
                      icon={<MessageCircle className="w-4 h-4" />}
                      error={errors.message}
                      {...register("message", {
                        required: "Message is required",
                        minLength: {
                          value: 10,
                          message: "Message must be at least 10 characters",
                        },
                      })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-md font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </FormProvider>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-red-500" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <ContactInfoCard
                  icon={<Phone className="w-5 h-5" />}
                  title="Emergency Hotline"
                  detail="+1 (123) 456-7890"
                  subtitle="24/7 available"
                  link="tel:+11234567890"
                  index={0}
                />
                <ContactInfoCard
                  icon={<Mail className="w-5 h-5" />}
                  title="Email Us"
                  detail="support@lifeflow.com"
                  subtitle="Typically replies within 24 hours"
                  link="mailto:support@lifeflow.com"
                  index={1}
                />
                <ContactInfoCard
                  icon={<MapPin className="w-5 h-5" />}
                  title="Our Headquarters"
                  detail="123 Blood Drive Ave, Suite 100"
                  subtitle="New York, NY 10001"
                  index={2}
                />
              </div>

              {/* Social Media Links */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com/lifeflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href="https://twitter.com/lifeflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a
                    href="https://instagram.com/lifeflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a
                    href="https://linkedin.com/company/lifeflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                Operating Hours
              </h3>
              <ul className="space-y-0">
                <OperatingHour day="Monday - Friday" time="8:00 AM - 8:00 PM" />
                <OperatingHour day="Saturday" time="9:00 AM - 5:00 PM" />
                <OperatingHour
                  day="Sunday"
                  time="Emergency Only"
                  isLast={true}
                />
              </ul>
            </div>

            {/* Map Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Find Us
              </h3>
              <div className="rounded-lg overflow-hidden h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Interactive map would be displayed here
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    123 Blood Drive Ave, New York, NY 10001
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-red-500" />
                Common Questions
              </h3>
              <div>
                {contactFaqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
