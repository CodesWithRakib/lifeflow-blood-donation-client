import { useState, useEffect } from "react";
import { User, Edit, Save, X, Droplet, MapPin } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import uploadImageToImageBB from "../../utils/imageUpload";
import { useQuery } from "@tanstack/react-query";
import getUserByEmail from "../../utils/getUserByemail";

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const axiosSecure = useAxios();

  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  });

  // Fetch location data only once
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const [districtRes, upazilaRes] = await Promise.all([
          axios("/districts.json"),
          axios("/upazilas.json"),
        ]);
        setDistricts(districtRes.data);
        setUpazilas(upazilaRes.data);
      } catch (error) {
        console.error("Error loading location data:", error);
        toast.error("Failed to load location data");
      }
    };

    fetchLocationData();
  }, []);

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
      setIsLoading(false);
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
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosSecure.patch(`/api/user/${authUser.email}`, {
        name: formData.name,
        avatar: formData.avatar,
        district: formData.district,
        upazila: formData.upazila,
        bloodGroup: formData.bloodGroup,
      });

      // If avatar or name changed, update Firebase profile too
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
      refetch();
      setEditMode(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUpazilas = districts.find((d) => d.name === formData.district)
    ? upazilas.filter(
        (u) =>
          u.district_id ===
          districts.find((d) => d.name === formData.district).id
      )
    : [];
  if (isLoading || userQueryLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-500 flex items-center gap-2 mb-4 sm:mb-0">
              <User className="h-6 w-6" />
              <span>My Profile</span>
            </h2>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploading}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                      <span>Saving...</span>
                    </>
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
                  alt="User Avatar"
                  className="h-32 w-32 rounded-full object-cover border-4 border-amber-500 dark:border-amber-600 shadow-md transition-all duration-300 group-hover:opacity-90"
                />
                {editMode && (
                  <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110">
                    <label
                      className={`cursor-pointer ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                        disabled={isUploading}
                      />
                      {isUploading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-amber-600 dark:text-amber-500"
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
                      ) : (
                        <Edit className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                      )}
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  District
                </label>
                <div className="relative">
                  <select
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upazila
                </label>
                <div className="relative">
                  <select
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blood Group
                </label>
                <div className="relative">
                  <select
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
