import useTitle from "../../hooks/useTitle";

const Privacy = () => {
  useTitle("Privacy Policy | LifeFlow - Blood Donation");
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Privacy Policy
      </h1>

      <div className="prose dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Last Updated: January 1, 2023
        </p>

        <h2 className="text-xl font-semibold mb-4">
          1. Information We Collect
        </h2>
        <p className="mb-6">
          We collect personal information you provide when you register as a
          donor or recipient, including your name, email address, blood type,
          and location data. We also automatically collect certain information
          about your device and usage of our services.
        </p>

        <h2 className="text-xl font-semibold mb-4">
          2. How We Use Your Information
        </h2>
        <p className="mb-6">
          Your information is used to facilitate blood donation matches, improve
          our services, communicate with you, and ensure the security of our
          platform. We never sell your personal information to third parties.
        </p>

        <h2 className="text-xl font-semibold mb-4">3. Data Security</h2>
        <p className="mb-6">
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, or destruction.
        </p>

        <h2 className="text-xl font-semibold mb-4">4. Your Rights</h2>
        <p className="mb-6">
          You have the right to access, correct, or delete your personal
          information. You may also withdraw consent for data processing at any
          time by contacting us.
        </p>

        <h2 className="text-xl font-semibold mb-4">
          5. Changes to This Policy
        </h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new policy on this page.
        </p>

        <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at
          privacy@lifeflow.com.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
