import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { Calendar, Clock, Droplet, MapPin, Hospital } from "lucide-react";

const CreateDonationRequest = () => {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const selectedDistrict = watch("district");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtRes, upazilaRes] = await Promise.all([
          axios("/districts.json"),
          axios("/upazilas.json"),
        ]);
        setDistricts(districtRes?.data);
        setUpazilas(upazilaRes?.data);
      } catch (error) {
        console.error("Error loading districts and upazilas", error);
      }
    };
    fetchData();
  }, []);

  const loggedInUser = {
    name: user?.displayName,
    email: user?.email,
    isBlocked: false,
  };

  const onSubmit = async (data) => {
    if (loggedInUser.isBlocked) {
      alert("You are blocked from creating requests.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullData = {
        ...data,
        requesterName: loggedInUser.name,
        requesterEmail: loggedInUser.email,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Replace with your actual API call
      // await axios.post('/api/donation-requests', fullData);
      console.log(fullData);

      reset();
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-500 mb-6">
        Create Donation Request
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Requester Name
            </label>
            <input
              type="text"
              value={loggedInUser.name}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Requester Email
            </label>
            <input
              type="email"
              value={loggedInUser.email}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Recipient Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("recipientName", {
                required: "Recipient name is required",
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.recipientName
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            />
            {errors.recipientName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.recipientName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Recipient District <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("district", { required: "District is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.district
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none pr-10`}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.district && (
              <p className="mt-1 text-sm text-red-500">
                {errors.district.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Recipient Upazila <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("upazila", { required: "Upazila is required" })}
                disabled={!selectedDistrict}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.upazila
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none pr-10 ${
                  !selectedDistrict ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Select Upazila</option>
                {upazilas
                  .filter((u) => u.district_name === selectedDistrict)
                  .map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.upazila && (
              <p className="mt-1 text-sm text-red-500">
                {errors.upazila.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Hospital Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register("hospital", {
                  required: "Hospital name is required",
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.hospital
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-10`}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Hospital className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.hospital && (
              <p className="mt-1 text-sm text-red-500">
                {errors.hospital.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Full Address <span className="text-red-500">*</span>
            </label>
            <input
              {...register("address", { required: "Address is required" })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.address
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Blood Group <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("bloodGroup", {
                  required: "Blood group is required",
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.bloodGroup
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none pr-10`}
              >
                <option value="">Select Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  )
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Droplet className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.bloodGroup && (
              <p className="mt-1 text-sm text-red-500">
                {errors.bloodGroup.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Donation Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.date
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-10`}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Donation Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="time"
                {...register("time", { required: "Time is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.time
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-10`}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.time && (
              <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Request Message <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("message", { required: "Message is required" })}
            rows={4}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.message
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder="Describe why you need the blood"
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
