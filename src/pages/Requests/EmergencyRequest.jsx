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
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import useTitle from "../../hooks/useTitle";
import { useForm } from "react-hook-form";
// Import district and upazila data
import districts from "../../constants/districts";
import upazilas from "../../constants/upazilas";
import useRole from "../../hooks/useRole";

const EmergencyRequest = () => {
  const { user } = useAuth();
  const { isBlocked } = useRole();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableUpazilas, setAvailableUpazilas] = useState([]);
  useTitle("Emergency Blood Request | LifeFlow - Blood Donation");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
    watch,
  } = useForm({
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      patientName: "",
      patientAge: "",
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
      urgencyLevel: "",
      reason: "",
      message: "",
    },
  });

  const recipientDistrict = watch("recipientDistrict");

  // Update available upazilas when district changes
  useEffect(() => {
    if (recipientDistrict) {
      // Find the selected district object
      const selectedDistrictObj = districts.find(
        (district) => district.name === recipientDistrict
      );

      if (selectedDistrictObj) {
        // Filter upazilas based on the selected district's ID
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

  const loggedInUser = {
    name: user?.displayName,
    email: user?.email,
    isBlocked,
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const urgencyLevels = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
  ];

  const onSubmit = async (formData) => {
    try {
      // Clear any previous errors
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
      // Format data for backend to match server expectations
      const requestData = {
        // Patient Information
        patientName: formData.patientName,
        patientAge: parseInt(formData.patientAge),
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
        urgencyLevel: formData.urgencyLevel,
        reason: formData.reason,
        message: formData.message,
        // Requester Information
        requesterName: user?.displayName || formData.contactPerson,
        requesterEmail: user?.email || formData.contactEmail,
      };
      console.log("Submitting emergency request:", requestData);
      // Updated endpoint to match server route
      const response = await axiosSecure.post("/donations", requestData);
      if (response.data.success) {
        setIsSubmitted(true);
        reset(); // Reset form after successful submission
        toast.success("Emergency request submitted successfully!");
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle specific error responses
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          // Handle validation errors from backend
          if (data.error && typeof data.error === "object") {
            // If error is an object with field-specific errors
            Object.entries(data.error).forEach(([field, message]) => {
              setError(field, { message });
            });
          } else {
            // If error is a simple string
            toast.error(data.error || "Validation failed");
          }
        } else if (status === 401) {
          toast.error("Please login to submit an emergency request");
          navigate("/login", { state: { from: "/emergency-request" } });
        } else if (status === 403) {
          toast.error("You don't have permission to perform this action");
        } else if (status === 500) {
          toast.error("Server error. Please try again later");
        } else {
          toast.error(`Error: ${data.message || "Unknown error occurred"}`);
        }
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection");
      } else {
        // Other errors
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Handle form field errors
  const getFieldError = (fieldName) => {
    return errors[fieldName]?.message;
  };

  // Check if a field has an error
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
            Your emergency blood request has been submitted. We'll notify you as
            soon as we find matching donors.
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
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-8">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Emergency Blood Request
              </h1>
              <p className="text-red-100">
                Get urgent blood donation help when you need it most
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white/20 rounded-lg p-3">
              <AlertTriangle className="text-white w-6 h-6" />
              <span className="text-white font-medium">
                24/7 Emergency Support
              </span>
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
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg mr-3">
                  <AlertTriangle className="text-red-600 dark:text-red-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Emergency Request Form
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fill all required fields to submit your emergency request
                  </p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                {/* Patient Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <User className="mr-2 w-5 h-5" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Patient Name *
                      </label>
                      <input
                        {...register("patientName", {
                          required: "Patient name is required",
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("patientName")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter patient name"
                      />
                      {errors.patientName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.patientName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Patient Age *
                      </label>
                      <input
                        type="number"
                        {...register("patientAge", {
                          required: "Patient age is required",
                          min: { value: 1, message: "Age must be at least 1" },
                          max: {
                            value: 120,
                            message: "Age must be less than or equal to 120",
                          },
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          hasError("patientAge")
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter patient age"
                        min="1"
                        max="120"
                      />
                      {errors.patientAge && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.patientAge.message}
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                    <MapPin className="mr-2 w-5 h-5" />
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
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
                      Reason for Emergency *
                    </label>
                    <textarea
                      {...register("reason", {
                        required: "Reason is required",
                      })}
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        hasError("reason")
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Please describe the emergency situation..."
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Any additional information..."
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Urgency Level *
                    </label>
                    <select
                      {...register("urgencyLevel", {
                        required: "Urgency level is required",
                      })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        hasError("urgencyLevel")
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <option value="">Select urgency level</option>
                      {urgencyLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                    {errors.urgencyLevel && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.urgencyLevel.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
                        Submit Emergency Request
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
              {/* Emergency Contacts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800"
              >
                <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-4 flex items-center">
                  <AlertTriangle className="mr-2 w-5 h-5" />
                  Emergency Contacts
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                      24/7 Hotline
                    </p>
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                      +1 (800) 555-BLOOD
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                      Email Support
                    </p>
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                      emergency@lifeflow.com
                    </p>
                  </div>
                </div>
              </motion.div>
              {/* Process Steps */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock className="mr-2 w-5 h-5" />
                  What Happens Next?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 text-sm font-bold mr-3">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Request Verification
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        We verify your request within 15 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 text-sm font-bold mr-3">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Donor Matching
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        We find available donors in your area
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 text-sm font-bold mr-3">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Contact & Coordination
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        We connect donors with the hospital
                      </p>
                    </div>
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
                  <Calendar className="mr-2 w-5 h-5" />
                  Important Note
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Please ensure all information is accurate. False emergency
                  requests may result in legal consequences and prevent genuine
                  patients from receiving timely help.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequest;
