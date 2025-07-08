// components/LoginForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
  });

  const [showPassword, setShowPassword] = useState(false);

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 space-y-6 transition-colors duration-200"
      >
        <header className="text-center">
          <h1 className="text-3xl font-extrabold text-amber-600 dark:text-amber-500">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your details below
          </p>
        </header>

        {/* Email Field */}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-150 \${
              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-150 pr-10 \${
              errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
            {...register("password", { required: "Password is required" })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2">
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
            className="text-amber-600 dark:text-amber-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2 py-2.5 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
          <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            state={{ from: state?.from }}
            className="text-amber-600 dark:text-amber-500 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
