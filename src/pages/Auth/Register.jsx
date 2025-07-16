// pages/Register.jsx
import React from "react";
import RegisterForm from "../../components/form/registerForm";

const Register = () => {
  return (
    <div className=" flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
