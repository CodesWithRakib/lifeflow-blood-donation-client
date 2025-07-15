import { useState, useEffect } from "react";
import { User, Edit, Save, X, Droplet, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import uploadImageToImageBB from "../../utils/imageUpload";
import { useQuery } from "@tanstack/react-query";
import getUserByEmail from "../../utils/getUserByemail";
import districts from "../../constants/districts";
import upazilas from "../../constants/upazilas";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ParticleWaveSpinner from "../../components/common/ParticleWaveSpinner";

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const axiosSecure = useAxios();

  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
    isLoading: userQueryLoading,
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

  if (userQueryLoading || !userData) {
    return <ParticleWaveSpinner fullPage />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-500 flex items-center gap-2">
              <User className="h-6 w-6" />
              <span>My Profile</span>
            </h2>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                aria-label="Edit profile"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                  aria-label="Cancel editing"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploading}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  aria-label="Save changes"
                >
                  {isSaving ? (
                    <LoadingSpinner small />
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

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <img
                  src={
                    formData.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      formData.name
                    )}&background=ff9900&color=fff&size=128`
                  }
                  alt={`${formData.name}'s avatar`}
                  className="h-32 w-32 rounded-full object-cover border-4 border-amber-500 dark:border-amber-600 shadow-md transition-all duration-300 group-hover:opacity-90"
                />
                {editMode && (
                  <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110">
                    <label
                      className={`cursor-pointer ${
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
                        <Edit className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                      )}
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      ? "border-amber-400 focus:ring-amber-500 dark:border-amber-500 dark:focus:ring-amber-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-300"
                  }`}
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-300 focus:outline-none"
                />
              </div>

              {/* District Field */}
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                        ? "border-amber-400 focus:ring-amber-500 dark:border-amber-500 dark:focus:ring-amber-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-300"
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
              <div>
                <label
                  htmlFor="upazila"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                        ? "border-amber-400 focus:ring-amber-500 dark:border-amber-500 dark:focus:ring-amber-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-300"
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
              <div className="md:col-span-2">
                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                        ? "border-amber-400 focus:ring-amber-500 dark:border-amber-500 dark:focus:ring-amber-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-300"
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
