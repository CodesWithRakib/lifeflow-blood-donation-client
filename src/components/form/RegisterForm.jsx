// components/RegisterForm.jsx
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle, Eye, EyeOff, Loader2, Zap } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useLocation, useNavigate } from "react-router";
import useTitle from "../../hooks/useTitle";
import uploadImageToCloudinary from "../../utils/uploadImageToCloudinary";
import upazilas from "../../constants/upazilas";
import districts from "../../constants/districts";

// Helper function to generate random data
const generateRandomData = () => {
  // Random names
  const firstNames = [
    "Alex",
    "Jamie",
    "Taylor",
    "Jordan",
    "Casey",
    "Morgan",
    "Riley",
    "Avery",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
  ];

  // Random blood groups
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Random districts (using the imported districts array)
  const randomDistrict =
    districts[Math.floor(Math.random() * districts.length)];

  // Random upazila from selected district
  const districtUpazilas = upazilas.filter(
    (u) => u.district_id === randomDistrict.id
  );
  const randomUpazila =
    districtUpazilas[Math.floor(Math.random() * districtUpazilas.length)];

  // Generate random password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  return {
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`,
    email: `user${Math.floor(Math.random() * 10000)}@example.com`,
    password: generatePassword(),
    bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
    district: randomDistrict.name,
    districtId: randomDistrict.id,
    upazila: randomUpazila.name,
  };
};

const RegisterForm = () => {
  const { createUser, updateUser, setUser } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const { state } = useLocation();
  useTitle("Register");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("idle");
  const [quickFillMode, setQuickFillMode] = useState(false);

  const handleQuickFill = () => {
    const randomData = generateRandomData();

    setValue("name", randomData.name);
    setValue("email", randomData.email);
    setValue("password", randomData.password);
    setValue("confirm_password", randomData.password);
    setValue("bloodGroup", randomData.bloodGroup);
    setValue("district", randomData.district);

    setSelectedDistrictId(randomData.districtId);
    setValue("upazila", randomData.upazila);

    setQuickFillMode(true);
    toast.success("Random test data generated!");
  };

  const onSubmit = async (data) => {
    try {
      setRegistrationStatus("registering");
      const imageFile = data.avatar[0];
      const imageUrl = await uploadImageToCloudinary(imageFile);

      let newUser = {
        email: data.email,
        name: data.name,
        avatar: imageUrl,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
        role: "donor",
        status: "active",
      };

      const userCredential = await createUser(data.email, data.password);
      const user = userCredential.user;
      setUser(user);
      newUser.firebaseUid = user.uid;

      await updateUser({
        displayName: data.name,
        photoURL: imageUrl,
      });

      await axiosSecure.post("/users", newUser);
      setRegistrationStatus("success");
      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate(state?.from || "/");
      }, 1500);
    } catch (error) {
      console.error(error);
      setRegistrationStatus("idle");
      toast.error(error.message || "Failed to register user");
    }
  };

  const filteredUpazilas = selectedDistrictId
    ? upazilas.filter((u) => u.district_id === selectedDistrictId)
    : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-xl">
        {/* Quick Fill Button */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleQuickFill}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 rounded-lg transition-all duration-200"
          >
            <Zap size={16} />
            Quick Fill
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-3xl"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 p-6 text-center">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="mt-1 text-amber-100 dark:text-amber-200">
              Join our community of donors
            </p>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-amber-500"
                    } dark:bg-gray-700 dark:text-white`}
                  />
                  {quickFillMode && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded">
                        Random
                      </span>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-amber-500"
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <svg
                        className="w-10 h-10 text-gray-500 dark:text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG (Max. 2MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      {...register("avatar", {
                        required: "Profile photo is required",
                        onChange: (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setAvatarPreview(URL.createObjectURL(file));
                          }
                        },
                      })}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  {avatarPreview && (
                    <div className="relative">
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-amber-500 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview(null);
                          setValue("avatar", null);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                {errors.avatar && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.avatar.message}
                  </span>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blood Group
                </label>
                <select
                  {...register("bloodGroup", {
                    required: "Blood group is required",
                  })}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10 ${
                    errors.bloodGroup
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-amber-500"
                  } dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Select your blood group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    )
                  )}
                </select>
                {errors.bloodGroup && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.bloodGroup.message}
                  </span>
                )}
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    District
                  </label>
                  <select
                    {...register("district", {
                      required: "District is required",
                    })}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      setValue("district", selectedName);
                      const selected = districts.find(
                        (d) => d.name === selectedName
                      );
                      setSelectedDistrictId(selected?.id);
                      setValue("upazila", "");
                    }}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10 ${
                      errors.district
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-amber-500"
                    } dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="">Select district</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.district.message}
                    </span>
                  )}
                </div>

                {/* Upazila */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upazila
                  </label>
                  <select
                    {...register("upazila", {
                      required: "Upazila is required",
                    })}
                    disabled={!selectedDistrictId}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem] pr-10 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.upazila
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-amber-500"
                    } dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="">Select upazila</option>
                    {filteredUpazilas.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  {errors.upazila && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.upazila.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                        message:
                          "Password must contain at least one letter and one number",
                      },
                    })}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 pr-12 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-amber-500"
                    } dark:bg-gray-700 dark:text-white`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 ${
                    errors.confirm_password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-amber-500"
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.confirm_password && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.confirm_password.message}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registrationStatus !== "idle"}
              className={`w-full text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] ${
                registrationStatus === "idle"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700"
                  : registrationStatus === "registering"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-700 dark:to-amber-800"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700"
              }
              disabled:opacity-90 disabled:cursor-not-allowed
            `}
            >
              {registrationStatus === "idle" ? (
                "Register Now"
              ) : registrationStatus === "registering" ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Registration Successful!
                </>
              )}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-amber-600 dark:text-amber-500 hover:underline font-medium"
              >
                Sign in
              </a>
            </div>
          </div>
        </form>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
