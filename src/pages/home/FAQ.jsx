import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
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
        "Yes, but you may need to wait 3-12 months depending on where you got the tattoo and whether it was done in a licensed facility.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              className="flex justify-between items-center w-full p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="font-medium text-gray-900 dark:text-white">
                {faq.question}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  activeIndex === index ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {activeIndex === index && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
