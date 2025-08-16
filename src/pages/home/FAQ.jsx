import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  Minus,
  HelpCircle,
  BookOpen,
  Filter,
  X,
} from "lucide-react";

// Memoized FAQ Item Component
const FAQItem = React.memo(({ faq, isOpen, index, toggleFAQ }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      <button
        className="w-full flex justify-between items-center p-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => toggleFAQ(index)}
        aria-expanded={isOpen}
        aria-controls={`faq-${index}`}
      >
        <span className="font-medium text-gray-900 dark:text-white text-left flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          {faq.question}
        </span>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <Minus className="w-5 h-5 text-red-500" />
          ) : (
            <Plus className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                {faq.answer}
              </div>
              {faq.related && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Related topics:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {faq.related.map((topic, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allExpanded, setAllExpanded] = useState(false);

  // Enhanced FAQ data with categories and related topics
  const faqs = useMemo(
    () => [
      {
        question: "Who can donate blood?",
        answer:
          "Generally, anyone between 18-65 years old, weighing at least 50kg, and in good health can donate blood. Specific eligibility criteria may vary based on health conditions, medications, and travel history.",
        category: "Eligibility",
        related: [
          "Age requirements",
          "Health conditions",
          "Weight requirements",
        ],
      },
      {
        question: "How often can I donate blood?",
        answer:
          "You can donate whole blood every 56 days (about 8 weeks). Platelet donations can be made more frequently, up to 24 times a year. Plasma donations can be made every 28 days.",
        category: "Donation Process",
        related: ["Recovery time", "Platelet donation", "Plasma donation"],
      },
      {
        question: "Is blood donation safe?",
        answer:
          "Yes, blood donation is completely safe. All equipment is sterile, used only once, and then properly disposed. The process is supervised by trained medical professionals to ensure donor safety.",
        category: "Safety",
        related: [
          "Sterile equipment",
          "Medical supervision",
          "Infection control",
        ],
      },
      {
        question: "How long does the donation process take?",
        answer:
          "The actual donation takes about 10 minutes. The entire process including registration, health screening, donation, and recovery takes about 45 minutes to an hour.",
        category: "Donation Process",
        related: ["Registration", "Health screening", "Recovery time"],
      },
      {
        question: "Can I donate if I have a tattoo?",
        answer:
          "Yes, but you may need to wait 3–12 months depending on where you got the tattoo and whether it was done in a licensed facility. This waiting period helps ensure there's no risk of bloodborne infections.",
        category: "Eligibility",
        related: ["Tattoo regulations", "Waiting periods", "Infection risks"],
      },
      {
        question: "What should I eat before donating blood?",
        answer:
          "Eat a healthy meal low in fat and drink plenty of water before donating. Avoid fatty foods, alcohol, and caffeinated beverages. Iron-rich foods in the days before donation can help maintain your iron levels.",
        category: "Preparation",
        related: ["Iron-rich foods", "Hydration", "Dietary restrictions"],
      },
      {
        question: "Are there any side effects after donating blood?",
        answer:
          "Most people feel fine after donating. Some may experience temporary lightheadedness, bruising at the needle site, or fatigue. These effects typically resolve within a day or two. It's important to rest and hydrate after donation.",
        category: "After Donation",
        related: ["Common side effects", "Recovery tips", "When to seek help"],
      },
      {
        question: "Can I donate blood if I'm taking medication?",
        answer:
          "It depends on the medication. Some medications may defer you from donating temporarily, while others are acceptable. Bring a list of your medications when you donate, and the staff will determine your eligibility.",
        category: "Eligibility",
        related: [
          "Medication deferral",
          "Prescription drugs",
          "Over-the-counter medications",
        ],
      },
    ],
    []
  );

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(faqs.map((faq) => faq.category))];
    return cats;
  }, [faqs]);

  // Filter FAQs based on search term and selected category
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        searchTerm === "" ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (faq.related &&
          faq.related.some((topic) =>
            topic.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchTerm, selectedCategory]);

  // Toggle FAQ item
  const toggleFAQ = useCallback((index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  // Toggle all FAQs
  const toggleAllFAQs = useCallback(() => {
    if (allExpanded) {
      setActiveIndex(null);
    } else {
      setActiveIndex(0); // Just set to first to indicate expanded state
    }
    setAllExpanded(!allExpanded);
  }, [allExpanded]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("All");
  }, []);

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-6"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Knowledge Center
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
        >
          Find answers to common questions about blood donation, eligibility,
          and the donation process.
        </motion.p>
      </div>

      {/* Search and Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions or keywords..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              aria-label="Search FAQs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-3">
            <div className="relative flex-grow md:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none block w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                aria-label="Filter by category"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              disabled={!searchTerm && selectedCategory === "All"}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                searchTerm || selectedCategory !== "All"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
              aria-label="Clear filters"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Expand/Collapse All Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={toggleAllFAQs}
            className="inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
            aria-label={allExpanded ? "Collapse all FAQs" : "Expand all FAQs"}
          >
            {allExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Collapse All
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Expand All
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={allExpanded || activeIndex === index}
              index={index}
              toggleFAQ={toggleFAQ}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <HelpCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No matching questions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Additional Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-red-100 dark:border-red-800/30"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
              Our support team is available 24/7 to answer any questions you may
              have about blood donation or our services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="mailto:support@lifeflow.com"
                className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Email Support
              </a>
              <a
                href="tel:+18005552566"
                className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Call Hotline
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;
