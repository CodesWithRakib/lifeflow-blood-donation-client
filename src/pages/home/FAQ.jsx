import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      question: "Who can donate blood?",
      answer:
        "Generally, anyone between 18-65 years old, weighing at least 50kg, and in good health can donate blood. Specific eligibility criteria may vary.",
    },
    {
      question: "How often can I donate blood?",
      answer:
        "You can donate whole blood every 56 days (about 8 weeks). Platelet donations can be made more frequently.",
    },
    {
      question: "Is blood donation safe?",
      answer:
        "Yes, blood donation is completely safe. All equipment is sterile, used only once, and then properly disposed.",
    },
    {
      question: "How long does the donation process take?",
      answer:
        "The actual donation takes about 10 minutes. The entire process including registration and recovery takes about 45 minutes to an hour.",
    },
    {
      question: "Can I donate if I have a tattoo?",
      answer:
        "Yes, but you may need to wait 3–12 months depending on where you got the tattoo and whether it was done in a licensed facility.",
    },
  ];

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
            >
              <button
                className="w-full flex justify-between items-center p-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-${index}`}
              >
                <span className="font-medium text-gray-900 dark:text-white text-left">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id={`faq-${index}`}
                className={`px-5 pb-4 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 transition-all duration-300 ease-in-out ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
