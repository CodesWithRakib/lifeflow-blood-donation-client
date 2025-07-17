import React from "react";
import LoginForm from "../../components/form/loginForm";
import useTitle from "../../hooks/useTitle";

const Login = () => {
  useTitle("Login | LifeFlow - Blood Donation");
  return (
    <div className="min-h-[calc(100vh-421px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
