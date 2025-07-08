import { Phone, Mail, MapPin, Droplet } from "lucide-react";

const DonorCard = ({ donor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-shrink-0">
            <img
              className="h-12 w-12 rounded-full object-cover"
              src={donor.avatar || "/default-avatar.png"}
              alt={donor.name}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {donor.name}
            </h3>
            <div className="flex items-center text-sm text-red-600 dark:text-red-400">
              <Droplet className="h-4 w-4 mr-1" />
              <span>{donor.bloodGroup}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPin className="h-5 w-5 mr-2 text-gray-400" />
            <span>
              {donor.district}, {donor.upazila}
            </span>
          </div>

          {donor.lastDonationDate && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <svg
                className="h-5 w-5 mr-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                Last donated:{" "}
                {new Date(donor.lastDonationDate).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="flex space-x-4 pt-2">
            <a
              href={`tel:${donor.phone}`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Phone className="h-4 w-4 mr-1.5" />
              Call
            </a>
            <a
              href={`mailto:${donor.email}`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Mail className="h-4 w-4 mr-1.5" />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorCard;
