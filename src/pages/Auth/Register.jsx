// pages/Register.jsx
import React from "react";
import RegisterForm from "../../components/form/registerForm";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
