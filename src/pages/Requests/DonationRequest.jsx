import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Droplet,
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  Send,
  CheckCircle,
  Hospital,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import useTitle from "../../hooks/useTitle";
import { useForm } from "react-hook-form";
import districts from "../../constants/districts";
import upazilas from "../../constants/upazilas";
import useRole from "../../hooks/useRole";

const DonationRequest = () => {
  const { user } = useAuth();
  const { isBlocked } = useRole();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableUpazilas, setAvailableUpazilas] = useState([]);
  useTitle("Donation Request | LifeFlow - Blood Donation");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      recipientName: "",
      recipientAge: "",
      bloodGroup: "",
      unitsRequired: "",
      hospitalName: "",
      hospitalAddress: "",
      recipientDistrict: "",
      recipientUpazila: "",
      contactPerson: user?.displayName || "",
      contactPhone: "",
      contactEmail: user?.email || "",
      date: "",
      time: "",
      reason: "",
      message: "",
    },
  });

  const recipientDistrict = watch("recipientDistrict");

  // Update available upazilas when district changes
  useEffect(() => {
    if (recipientDistrict) {
      const selectedDistrictObj = districts.find(
        (district) => district.name === recipientDistrict
      );

      if (selectedDistrictObj) {
        const filteredUpazilas = upazilas.filter(
          (upazila) => upazila.district_id === selectedDistrictObj.id
        );
        setAvailableUpazilas(filteredUpazilas);
      } else {
        setAvailableUpazilas([]);
      }
    } else {
      setAvailableUpazilas([]);
    }
  }, [recipientDistrict]);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const onSubmit = async (formData) => {
    try {
      clearErrors();

      // Validate required date is not in the past
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setError("date", {
          message: "Required date cannot be in the past",
        });
        return;
      }

      const requestData = {
        // Recipient Information
        recipientName: formData.recipientName,
        recipientAge: parseInt(formData.recipientAge),
        bloodGroup: formData.bloodGroup,
        unitsRequired: parseInt(formData.unitsRequired),
        // Hospital Information
        hospitalName: formData.hospitalName,
        hospitalAddress: formData.hospitalAddress,
        recipientDistrict: formData.recipientDistrict,
        recipientUpazila: formData.recipientUpazila,
        // Contact Information
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        // Request Details
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        message: formData.message,
        // Requester Information
        requesterName: user?.displayName || formData.contactPerson,
        requesterEmail: user?.email || formData.contactEmail,
      };

      console.log("Submitting donation request:", requestData);

      const response = await axiosSecure.post("/donation-request", requestData);

      if (response.data.success) {
        setIsSubmitted(true);
        reset();
        toast.success("Donation request submitted successfully!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          if (data.error && typeof data.error === "object") {
            Object.entries(data.error).forEach(([field, message]) => {
              setError(field, { message });
            });
          } else {
            toast.error(data.error || "Validation failed");
          }
        } else if (status === 401) {
          toast.error("Please login to submit a donation request");
          navigate("/login", { state: { from: "/donation-request" } });
        } else if (status === 403) {
          toast.error("You don't have permission to perform this action");
        } else if (status === 500) {
          toast.error("Server error. Please try again later");
        } else {
          toast.error(`Error: ${data.message || "Unknown error occurred"}`);
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const hasError = (fieldName) => {
    return !!errors[fieldName];
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 text-center"
        >
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Request Submitted Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your donation request has been submitted. We'll notify you as soon
            as we find matching donors.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-8">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Donation Request
              </h1>
              <p className="text-blue-100">
                Request blood donation for patients in need
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white/20 rounded-lg p-3">
              <Droplet className="text-white w-6 h-6" />
              <span className="text-white font-medium">Save Lives Today</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8"
            >
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3">
                  <Droplet className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Donation Request Form
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fill all required fields to submit your donation request
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                {/* Recipient Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <User className="mr-2 w-5 h-5" />
                    Recipient Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Recipient Name *
                      </label>
                      <input
                        {...register("recipientName", {
                          required: "Recipient name is required",
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("recipientName")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter recipient name"
                      />
                      {errors.recipientName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.recipientName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Recipient Age *
                      </label>
                      <input
                        type="number"
                        {...register("recipientAge", {
                          required: "Recipient age is required",
                          min: { value: 1, message: "Age must be at least 1" },
                          max: {
                            value: 120,
                            message: "Age must be less than or equal to 120",
                          },
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("recipientAge")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter recipient age"
                        min="1"
                        max="120"
                      />
                      {errors.recipientAge && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.recipientAge.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Blood Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Droplet className="mr-2 w-5 h-5" />
                    Blood Requirements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Blood Group *
                      </label>
                      <select
                        {...register("bloodGroup", {
                          required: "Blood group is required",
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("bloodGroup")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <option value="">Select blood group</option>
                        {bloodGroups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                      {errors.bloodGroup && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bloodGroup.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Units Required *
                      </label>
                      <input
                        type="number"
                        {...register("unitsRequired", {
                          required: "Units required is required",
                          min: {
                            value: 1,
                            message: "Units must be at least 1",
                          },
                          max: {
                            value: 10,
                            message: "Units must be less than or equal to 10",
                          },
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("unitsRequired")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Number of units"
                        min="1"
                        max="10"
                      />
                      {errors.unitsRequired && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.unitsRequired.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hospital Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Hospital className="mr-2 w-5 h-5" />
                    Hospital Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hospital Name *
                      </label>
                      <input
                        {...register("hospitalName", {
                          required: "Hospital name is required",
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("hospitalName")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter hospital name"
                      />
                      {errors.hospitalName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.hospitalName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hospital Address *
                      </label>
                      <textarea
                        {...register("hospitalAddress", {
                          required: "Hospital address is required",
                        })}
                        rows="3"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("hospitalAddress")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter hospital address"
                      />
                      {errors.hospitalAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.hospitalAddress.message}
                        </p>
                      )}
                    </div>
                    {/* District and Upazila Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          District *
                        </label>
                        <select
                          {...register("recipientDistrict", {
                            required: "District is required",
                          })}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            hasError("recipientDistrict")
                              ? "border-red-500 dark:border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          <option value="">Select district</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        {errors.recipientDistrict && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.recipientDistrict.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Upazila *
                        </label>
                        <select
                          {...register("recipientUpazila", {
                            required: "Upazila is required",
                          })}
                          disabled={!recipientDistrict}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            hasError("recipientUpazila")
                              ? "border-red-500 dark:border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          } ${
                            !recipientDistrict
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <option value="">
                            {recipientDistrict
                              ? "Select upazila"
                              : "Select district first"}
                          </option>
                          {availableUpazilas.map((upazila) => (
                            <option key={upazila.id} value={upazila.name}>
                              {upazila.name}
                            </option>
                          ))}
                        </select>
                        {errors.recipientUpazila && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.recipientUpazila.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Phone className="mr-2 w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Person *
                      </label>
                      <input
                        {...register("contactPerson", {
                          required: "Contact person is required",
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("contactPerson")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Contact person name"
                      />
                      {errors.contactPerson && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactPerson.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register("contactPhone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[\d\s\-\+\(\)]+$/,
                            message: "Invalid phone number format",
                          },
                          minLength: {
                            value: 10,
                            message: "Phone number must be at least 10 digits",
                          },
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("contactPhone")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Phone number"
                      />
                      {errors.contactPhone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactPhone.message}
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("contactEmail", {
                          required: "Email address is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format",
                          },
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("contactEmail")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Email address"
                      />
                      {errors.contactEmail && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FileText className="mr-2 w-5 h-5" />
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Required Date *
                      </label>
                      <input
                        type="date"
                        {...register("date", {
                          required: "Required date is required",
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("date")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                      {errors.date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.date.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Required Time *
                      </label>
                      <input
                        type="time"
                        {...register("time", {
                          required: "Required time is required",
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("time")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                      {errors.time && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.time.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reason for Donation *
                    </label>
                    <textarea
                      {...register("reason", {
                        required: "Reason is required",
                      })}
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        hasError("reason")
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Please describe why blood donation is needed..."
                    />
                    {errors.reason && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reason.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Message
                    </label>
                    <textarea
                      {...register("message")}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Any additional information..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
                        Submit Donation Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Donation Process */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
              >
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
                  <Droplet className="mr-2 w-5 h-5" />
                  How It Works
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      1. Submit Request
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      Fill out the form with patient details
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      2. Find Donors
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      We match with compatible donors nearby
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      3. Get Help
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      Donors contact you to arrange donation
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Eligibility Criteria */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <User className="mr-2 w-5 h-5" />
                  Donor Eligibility
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 text-xs font-bold mr-2 mt-0.5">
                      ✓
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Age between 18-60 years
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 text-xs font-bold mr-2 mt-0.5">
                      ✓
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Weight above 50 kg
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 text-xs font-bold mr-2 mt-0.5">
                      ✓
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Good general health
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 text-xs font-bold mr-2 mt-0.5">
                      ✓
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No major illnesses
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Important Note */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800"
              >
                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-3 flex items-center">
                  <AlertTriangle className="mr-2 w-5 h-5" />
                  Important Note
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Please ensure all information is accurate. False requests may
                  prevent genuine patients from receiving timely help.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationRequest;
