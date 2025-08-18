// components/LoginForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const LoginForm = () => {
  useTitle("Login");
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  const handleAdminAccess = () => {
    setValue("email", "admin@blood.com");
    setValue("password", "admin123");
    setAdminMode(true);
    toast.success("Admin credentials loaded");
  };

  const onSubmit = async (data) => {
    try {
      await logIn(data.email, data.password);
      toast.success("Successfully Signed In");
      navigate(state?.from || "/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Admin Access Button */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleAdminAccess}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 rounded-lg transition-all duration-200"
          >
            <Shield size={16} />
            Admin Access
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="mt-1 text-amber-100 dark:text-amber-200">
              Sign in to your account
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-amber-500"
                  } dark:bg-gray-700 dark:text-white`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {adminMode && (
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded">
                      Admin
                    </span>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 pr-12 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-amber-500"
                  } dark:bg-gray-700 dark:text-white`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-amber-600 dark:text-amber-500 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  state={{ from: state?.from }}
                  className="text-amber-600 dark:text-amber-500 hover:underline font-medium"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </form>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
