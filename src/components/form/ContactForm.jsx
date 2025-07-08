import React from "react";
import { useFormContext } from "react-hook-form";

const ContactForm = ({
  id,
  label,
  type = "text",
  placeholder,
  required,
  pattern,
  className = "",
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register(id, {
          required: required && `${label} is required`,
          pattern: pattern && {
            value: pattern.value,
            message: pattern.message,
          },
        })}
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${className}`}
        placeholder={placeholder}
      />
      {errors[id] && (
        <p className="mt-1 text-sm text-red-500">{errors[id].message}</p>
      )}
    </div>
  );
};

export default ContactForm;
