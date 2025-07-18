import {
  HeartPulse,
  Droplet,
  Activity,
  Apple,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { GiNightSleep, GiWaterDrop } from "react-icons/gi";
import useTitle from "../../hooks/useTitle";
const HealthTips = () => {
  useTitle("Health Tips - Blood Donation");
  const healthTips = [
    {
      category: "Before Donation",
      icon: <Droplet className="w-8 h-8 text-red-500" />,
      tips: [
        {
          title: "Eat Iron-Rich Foods",
          description:
            "Consume iron-rich foods like spinach, red meat, and beans 2-3 days before donating to maintain healthy iron levels.",
          icon: <Apple className="w-5 h-5 text-green-500" />,
        },
        {
          title: "Stay Hydrated",
          description:
            "Drink at least 500ml of water or juice before donation to help maintain your blood volume.",
          icon: <GiWaterDrop className="w-5 h-5 text-blue-500" />,
        },
        {
          title: "Get Enough Sleep",
          description:
            "Have a good night's sleep (7-8 hours) before donation day to help your body recover faster.",
          icon: <GiNightSleep className="w-5 h-5 text-purple-500" />,
        },
      ],
    },
    {
      category: "After Donation",
      icon: <HeartPulse className="w-8 h-8 text-red-500" />,
      tips: [
        {
          title: "Rest Immediately",
          description:
            "Relax for 10-15 minutes after donation and avoid strenuous activity for 24 hours.",
          icon: <Activity className="w-5 h-5 text-yellow-500" />,
        },
        {
          title: "Increase Fluid Intake",
          description:
            "Drink plenty of fluids (4 extra glasses) over the next 24 hours to replenish lost fluids.",
          icon: <GiWaterDrop className="w-5 h-5 text-blue-500" />,
        },
        {
          title: "Eat Nutritious Meals",
          description:
            "Consume iron-rich foods and vitamin C to help your body replace the donated red blood cells.",
          icon: <Apple className="w-5 h-5 text-green-500" />,
        },
      ],
    },
    {
      category: "General Health",
      icon: <Shield className="w-8 h-8 text-red-500" />,
      tips: [
        {
          title: "Maintain Iron Levels",
          description:
            "Regular donors should ensure adequate iron intake between donations (men: 8mg/day, women: 18mg/day).",
          icon: <Droplet className="w-5 h-5 text-red-500" />,
        },
        {
          title: "Donation Frequency",
          description:
            "Wait at least 8 weeks between whole blood donations to allow your body to replenish.",
          icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
        },
        {
          title: "Exercise Regularly",
          description:
            "Regular physical activity helps maintain healthy blood pressure and circulation.",
          icon: <Activity className="w-5 h-5 text-yellow-500" />,
        },
      ],
    },
  ];

  const donationFacts = [
    "Your body replaces the plasma you donate within 24-48 hours",
    "One donation can save up to 3 lives",
    "Only 37% of the population is eligible to donate blood",
    "Blood cannot be manufactured - it only comes from donors",
    "Donating blood may reduce the risk of heart disease",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-screen-2xl  mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <HeartPulse className="w-10 h-10 text-red-500" />
            <span>Donor Health Tips</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Essential health information to prepare for donation and maintain
            your wellbeing as a blood donor
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {healthTips.map((section, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-red-50 dark:bg-red-900/20 p-4 flex items-center gap-3 border-b border-red-100 dark:border-red-900/30">
                {section.icon}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.category}
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {section.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                        {tip.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {tip.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Did You Know Section */}
        <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Droplet className="w-8 h-8 text-red-500" />
            <span>Did You Know?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {donationFacts.map((fact, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <p className="text-gray-800 dark:text-gray-200">{fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-16">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 border-b border-red-100 dark:border-red-900/30">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <span>Frequently Asked Questions</span>
            </h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[
              {
                question: "How often can I donate blood?",
                answer:
                  "You can donate whole blood every 8 weeks (56 days). Platelet donations can be made more frequently, up to 24 times per year.",
              },
              {
                question: "What should I do if I feel faint after donating?",
                answer:
                  "Lie down with your feet elevated until you feel better. Drink plenty of fluids and avoid sudden movements. Inform staff if symptoms persist.",
              },
              {
                question: "Can I donate if I have a cold or flu?",
                answer:
                  "No, you should wait until you've fully recovered and feel well for at least 48 hours before donating.",
              },
              {
                question: "Does donating blood hurt?",
                answer:
                  "You may feel a brief pinch when the needle is inserted, but the donation process itself is generally painless.",
              },
            ].map((faq, index) => (
              <div key={index} className="p-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-600 to-amber-500 rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Your blood donation can save lives. Book an appointment today and
            become a hero in someone's story.
          </p>
          <button className="bg-white text-red-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg shadow-md transition-colors">
            Schedule Donation
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthTips;
