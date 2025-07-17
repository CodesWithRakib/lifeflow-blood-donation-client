import useTitle from "../../hooks/useTitle";

const TermsOfService = () => {
  useTitle("Terms of Service | LifeFlow - Blood Donation");
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Terms of Service
      </h1>

      <div className="prose dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Last Updated: January 1, 2023
        </p>

        <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-6">
          By accessing or using LifeFlow's services, you agree to be bound by
          these Terms of Service. If you disagree with any part, you may not
          access the service.
        </p>

        <h2 className="text-xl font-semibold mb-4">2. User Responsibilities</h2>
        <p className="mb-6">
          You agree to provide accurate information and use the service only for
          lawful purposes. You are responsible for maintaining the
          confidentiality of your account credentials.
        </p>

        <h2 className="text-xl font-semibold mb-4">3. Donor Eligibility</h2>
        <p className="mb-6">
          Donors must meet all eligibility requirements for blood donation in
          their jurisdiction. LifeFlow is not responsible for verifying donor
          eligibility.
        </p>

        <h2 className="text-xl font-semibold mb-4">
          4. Limitation of Liability
        </h2>
        <p className="mb-6">
          LifeFlow acts only as a platform connecting donors and recipients. We
          are not responsible for the quality, safety, or legality of any blood
          donations facilitated through our service.
        </p>

        <h2 className="text-xl font-semibold mb-4">5. Service Modifications</h2>
        <p className="mb-6">
          We reserve the right to modify or discontinue the service at any time
          without notice. We shall not be liable for any modification,
          suspension, or discontinuance.
        </p>

        <h2 className="text-xl font-semibold mb-4">6. Governing Law</h2>
        <p>
          These Terms shall be governed by the laws of the State of Delaware
          without regard to its conflict of law provisions.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
