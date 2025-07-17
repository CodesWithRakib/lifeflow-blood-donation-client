import React from "react";
import RegisterForm from "../../components/form/registerForm";
import useTitle from "../../hooks/useTitle";

const Register = () => {
  useTitle("Register | LifeFlow - Blood Donation");
  return (
    <div className=" flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
