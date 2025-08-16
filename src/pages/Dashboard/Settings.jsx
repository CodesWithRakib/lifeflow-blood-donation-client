import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiLock,
  FiBell,
  FiMail,
  FiDroplet,
  FiGlobe,
  FiHelpCircle,
  FiPhone,
} from "react-icons/fi";
import useTitle from "../../hooks/useTitle";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import getUserByEmail from "../../utils/getUserByemail";

const Settings = () => {
  useTitle("Settings | LifeFlow - Blood Donation");
  const { user: authUser } = useAuth();
  const axiosSecure = useAxios();
  const [activeTab, setActiveTab] = useState("profile");

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", authUser?.email],
    queryFn: () => getUserByEmail(axiosSecure),
    enabled: !!authUser?.email,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodType: "",
    notifications: true,
    location: "",
    language: "English",
    showDonorStatus: true,
    showBloodType: true,
  });

  // Initialize form data when userData is available
  useEffect(() => {
    if (userData && authUser) {
      setFormData({
        name: userData.name || authUser.displayName || "",
        email: authUser.email || "",
        phone: userData.phone || "",
        bloodType: userData.bloodGroup || "",
        notifications: userData.notifications !== false, // default to true if not set
        location: userData.district || "",
        language: userData.language || "English",
        showDonorStatus: userData.showDonorStatus !== false,
        showBloodType: userData.showBloodType !== false,
      });
    }
  }, [userData, authUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.patch(`/user/${authUser.email}`, {
        name: formData.name,
        phone: formData.phone,
        bloodGroup: formData.bloodType,
        notifications: formData.notifications,
        district: formData.location,
        language: formData.language,
        showDonorStatus: formData.showDonorStatus,
        showBloodType: formData.showBloodType,
      });
      toast.success("Settings saved successfully!");
      refetch();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };

  const tabs = [
    { id: "profile", icon: <FiUser />, label: "Profile" },
    { id: "security", icon: <FiLock />, label: "Security" },
    { id: "notifications", icon: <FiBell />, label: "Notifications" },
    { id: "donation", icon: <FiDroplet />, label: "Donation" },
    { id: "preferences", icon: <FiGlobe />, label: "Preferences" },
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Manage your personal information and preferences
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
              <nav className="p-4">
                <ul className="space-y-1">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? "bg-red-100 dark:bg-gray-600 text-red-700 dark:text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        <span className="mr-3">{tab.icon}</span>
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                    <FiUser className="mr-2" /> Personal Information
                  </h2>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="bloodType"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Blood Type
                      </label>
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Blood Type</option>
                        {bloodTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                    <FiLock className="mr-2" /> Security Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-md">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                        Update Password
                      </button>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-md">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                    <FiBell className="mr-2" /> Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifications"
                          name="notifications"
                          type="checkbox"
                          checked={formData.notifications}
                          onChange={handleChange}
                          className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="notifications"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          Email Notifications
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receive important updates about blood donation
                          opportunities
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-md">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                        Notification Types
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="emergencyAlerts"
                              name="emergencyAlerts"
                              type="checkbox"
                              checked={formData.notifications}
                              onChange={handleChange}
                              className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="emergencyAlerts"
                              className="font-medium text-gray-700 dark:text-gray-300"
                            >
                              Emergency Blood Needs
                            </label>
                            <p className="text-gray-500 dark:text-gray-400">
                              Get alerts when there are urgent blood
                              requirements in your area
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="donationReminders"
                              name="donationReminders"
                              type="checkbox"
                              checked={formData.notifications}
                              onChange={handleChange}
                              className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="donationReminders"
                              className="font-medium text-gray-700 dark:text-gray-300"
                            >
                              Donation Reminders
                            </label>
                            <p className="text-gray-500 dark:text-gray-400">
                              Reminders when you're eligible to donate again
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Donation Tab */}
              {activeTab === "donation" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                    <FiDroplet className="mr-2" /> Donation Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-md">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                        Donation History
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        View your past blood donation records
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                        View History
                      </button>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-md">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                        Donation Preferences
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Preferred Donation Center
                          </label>
                          <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option>Select a center</option>
                            <option>City Blood Bank</option>
                            <option>Red Cross Center</option>
                            <option>Community Hospital</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Preferred Donation Type
                          </label>
                          <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option>Whole Blood</option>
                            <option>Plasma</option>
                            <option>Platelets</option>
                          </select>
                        </div>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                    <FiGlobe className="mr-2" /> Account Preferences
                  </h2>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                      Privacy Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="showDonorStatus"
                            name="showDonorStatus"
                            type="checkbox"
                            checked={formData.showDonorStatus}
                            onChange={handleChange}
                            className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 dark:border-gray-600 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="showDonorStatus"
                            className="font-medium text-gray-700 dark:text-gray-300"
                          >
                            Show my donor status publicly
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Allow others to see that I'm a blood donor
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="showBloodType"
                            name="showBloodType"
                            type="checkbox"
                            checked={formData.showBloodType}
                            onChange={handleChange}
                            className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 dark:border-gray-600 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="showBloodType"
                            className="font-medium text-gray-700 dark:text-gray-300"
                          >
                            Show my blood type to matched recipients
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Only visible when there's a matching need
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Need help?{" "}
            <a
              href="#"
              className="text-red-600 dark:text-red-400 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
