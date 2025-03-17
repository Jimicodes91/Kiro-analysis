import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { IoIosArrowDown } from "react-icons/io";

type FormSelectProps = {
  id?: string;
  label?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  className?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  options,
  placeholder,
  className = "",
  error,
  register,
  disabled = false,
  value,
  onChange,
  ...props
}) => {
  // Track if a real option has been selected (for controlled component scenario)
  const [hasSelection, setHasSelection] = useState(!!value);

  // Handle select changes if this is being used as a controlled component
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
    setHasSelection(!!e.target.value);
  };

  return (
    <div className="relative space-y-2">
      {label && (
        <label htmlFor={id} className="text-[16px] font-medium text-black">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          {...props}
          {...(register || {})}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          className={`${className} w-full px-4 py-3 pr-10 rounded-[100px] font-[400] border h-[48px] border-[#00000033] text-[14px] focus:outline-none appearance-none ${
            hasSelection ? "text-black" : "text-gray-400"
          } ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "focus:border-black focus:bg-white"
          }`}
        >
          {(placeholder || label) && (
            <option value="" className="text-gray-400">
              {placeholder ? placeholder : `Select ${label}`}
            </option>
          )}
          {options.map(({ value, label }) => (
            <option key={value} value={value} className="text-black">
              {label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <IoIosArrowDown className="h-5 w-5 text-black" />
        </div>
      </div>
      {error && <span className="text-[16px] text-red-500">{error}</span>}
    </div>
  );
};