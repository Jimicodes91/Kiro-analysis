import { UseFormRegisterReturn } from "react-hook-form";
import { useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import type { ChangeEvent, FocusEvent, KeyboardEvent } from "react";

type FormInputProps = {
  type?: "text" | "email" | "password" | "number";
  id?: string;
  value?: string;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  disabled?: boolean;
};

export const FormInput: React.FC<FormInputProps> = ({
  type = "text",
  id,
  value,
  onFocus,
  onKeyDown,
  onChange,
  placeholder,
  className = "",
  register,
  error,
  disabled = false,
  label,
}) => {
  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  return (
    <div className="relative max-w-[460px] space-y-2">
      <label htmlFor={id} className="text-base font-medium text-black">
      {label ? label : placeholder}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          value={value}
          {...register}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onChange={onChange}
          placeholder={placeholder}
          min={type === "number" ? 0 : undefined}
          disabled={disabled}
          className={`${className} w-full max-w-[460px] px-4 py-4 rounded-[100px] font-medium border h-[48px] border-gray-200 placeholder-gray-500 text-[16px] focus:outline-none ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "focus:border-gray-400 focus:bg-white"
          }`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center justify-center w-6 h-6 my-auto text-gray-500 focus:outline-none"
            disabled={disabled}
          >
            {inputType === "password" ? (
              <IoEyeOff className="w-6 h-6" />
            ) : (
              <IoEye className="w-6 h-6" />
            )}
          </button>
        )}
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};