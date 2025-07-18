import { useState, useEffect } from "react";
import { User, Edit, Save, X, Droplet, MapPin, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import uploadImageToImageBB from "../../utils/imageUpload";
import { useQuery } from "@tanstack/react-query";
import getUserByEmail from "../../utils/getUserByemail";
import districts from "../../constants/districts";
import upazilas from "../../constants/upazilas";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useTitle from "../../hooks/useTitle";

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const axiosSecure = useAxios();

  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useTitle("Profile | LifeFlow - Blood Donation");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    district: "",
    upazila: "",
    bloodGroup: "",
  });

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", authUser?.email],
    queryFn: () => getUserByEmail(axiosSecure),
    enabled: !!authUser?.email,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Update form data when userData is fetched
  useEffect(() => {
    if (userData && authUser) {
      setFormData({
        name: userData.name || authUser.displayName || "",
        email: authUser.email || "",
        avatar: userData.avatar || authUser.photoURL || "",
        district: userData.district || "",
        upazila: userData.upazila || "",
        bloodGroup: userData.bloodGroup || "",
      });
    }
  }, [userData, authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (userData && authUser) {
      setFormData({
        name: userData.name || authUser.displayName || "",
        email: authUser.email || "",
        avatar: userData.avatar || authUser.photoURL || "",
        district: userData.district || "",
        upazila: userData.upazila || "",
        bloodGroup: userData.bloodGroup || "",
      });
    }
    setEditMode(false);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImageToImageBB(file);
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      toast.success("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update backend first
      await axiosSecure.patch(`/user/${authUser.email}`, {
        name: formData.name,
        avatar: formData.avatar,
        district: formData.district,
        upazila: formData.upazila,
        bloodGroup: formData.bloodGroup,
      });

      // Then update Firebase if needed
      if (
        formData.name !== authUser.displayName ||
        formData.avatar !== authUser.photoURL
      ) {
        await updateUser({
          displayName: formData.name,
          photoURL: formData.avatar,
        });
      }

      toast.success("Profile updated successfully!");
      await refetch();
      setEditMode(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUpazilas = formData.district
    ? upazilas.filter(
        (u) =>
          u.district_id ===
          districts.find((d) => d.name === formData.district)?.id
      )
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-red-50 to-amber-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <User className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            </div>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Edit profile"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="Cancel editing"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploading}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  aria-label="Save changes"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group mb-4">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={
                      formData.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        formData.name
                      )}&background=ef4444&color=fff&size=256`
                    }
                    alt={`${formData.name}'s avatar`}
                    className="h-full w-full object-cover"
                  />
                  {editMode && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <label
                        className={`cursor-pointer p-2 bg-white bg-opacity-80 rounded-full ${
                          isUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        aria-label="Change profile picture"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                          disabled={isUploading}
                        />
                        {isUploading ? (
                          <LoadingSpinner small />
                        ) : (
                          <Edit className="h-5 w-5 text-red-600" />
                        )}
                      </label>
                    </div>
                  )}
                </div>
                {isUploading && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Uploading image...
                  </p>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                    editMode
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                      : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-600"
                  }`}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border bg-gray-50 border-gray-200 cursor-not-allowed text-gray-600 focus:outline-none"
                />
              </div>

              {/* District Field */}
              <div className="space-y-1">
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700"
                >
                  District
                </label>
                <div className="relative">
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all appearance-none ${
                      editMode
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                        : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-600"
                    }`}
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Upazila Field */}
              <div className="space-y-1">
                <label
                  htmlFor="upazila"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upazila
                </label>
                <div className="relative">
                  <select
                    id="upazila"
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleChange}
                    disabled={!editMode || !formData.district}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all appearance-none ${
                      editMode
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                        : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-600"
                    } ${
                      !formData.district ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="">Select Upazila</option>
                    {filteredUpazilas.map((upazila) => (
                      <option key={upazila.id} value={upazila.name}>
                        {upazila.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Blood Group Field */}
              <div className="md:col-span-2 space-y-1">
                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-medium text-gray-700"
                >
                  Blood Group
                </label>
                <div className="relative">
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all appearance-none ${
                      editMode
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                        : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-600"
                    }`}
                  >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      )
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Droplet className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
