import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Calendar, Clock, Droplet, MapPin, Hospital } from "lucide-react";
import useAxios from "../../hooks/useAxios";
import toast from "react-hot-toast";
import districts from "../../constants/districts";
import upazilas from "../../constants/upazilas";
import useRole from "../../hooks/useRole";
import useTitle from "../../hooks/useTitle";

const CreateDonationRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { isBlocked } = useRole();
  const axiosSecure = useAxios();

  useTitle("Create Donation Request | LifeFlow - Blood Donation");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const recipientDistrict = watch("recipientDistrict"); // Changed from selectedDistrict to recipientDistrict

  // Find the selected district object
  const selectedDistrictObj = districts.find(
    (d) => d.name === recipientDistrict
  );

  // Filter upazilas based on the selected district's ID
  const filteredUpazilas = selectedDistrictObj
    ? upazilas.filter(
        (upazila) => upazila.district_id === selectedDistrictObj.id
      )
    : [];

  const loggedInUser = {
    name: user?.displayName,
    email: user?.email,
    isBlocked,
  };

  const onSubmit = async (data) => {
    if (loggedInUser.isBlocked) {
      toast.error("You are blocked from creating requests.");
      return;
    }
    setIsSubmitting(true);
    try {
      const fullData = {
        ...data,
        requesterName: loggedInUser.name,
        requesterEmail: loggedInUser.email,
      };

      const response = await axiosSecure.post("/donations", fullData);
      if (response.status === 201) {
        toast.success("Request submitted successfully!");
        reset();
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 ">
      <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-500 mb-6">
        Create Donation Request
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                {...register("recipientDistrict", {
                  required: "Recipient District is required",
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.recipientDistrict
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
            {errors.recipientDistrict && (
              <p className="mt-1 text-sm text-red-500">
                {errors.recipientDistrict.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Recipient Upazila <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("recipientUpazila", {
                  required: "Recipient Upazila is required",
                })}
                disabled={!recipientDistrict} // Changed from selectedDistrict to recipientDistrict
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.recipientUpazila
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none pr-10 ${
                  !recipientDistrict ? "opacity-50 cursor-not-allowed" : "" // Changed from selectedDistrict to recipientDistrict
                }`}
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.recipientUpazila && (
              <p className="mt-1 text-sm text-red-500">
                {errors.recipientUpazila.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Hospital Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register("hospitalName", {
                  required: "Hospital name is required",
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.hospitalName
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-10`}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Hospital className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.hospitalName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.hospitalName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Full Address <span className="text-red-500">*</span>
            </label>
            <input
              {...register("fullAddress", {
                required: "Full Address is required",
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.fullAddress
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            />
            {errors.fullAddress && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullAddress.message}
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
