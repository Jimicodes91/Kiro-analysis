import { UseFormRegisterReturn } from "react-hook-form";
import { useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import type { ChangeEvent, FocusEvent, KeyboardEvent } from "react";

type FormInputProps = {
  type?: "text" | "email" | "password" | "number" | "textarea";
  id?: string;
  value?: string;
  onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string | { message?: string };
  register?: UseFormRegisterReturn;
  disabled?: boolean;
  rows?: number;
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
  rows=3,
  ...props
}) => {
  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  const isTextarea = type === "textarea";

  return (
    <div className="relative space-y-2">
      <label htmlFor={id} className="text-[16px] font-medium text-[#00000099]">
      {label ? label : placeholder}
      </label>
      <div className="relative">
      {isTextarea ? (
          <textarea
            id={id}
            value={value}
            {...register}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`${className} w-full px-4 py-4 rounded-[16px] font-[400] border border-[#00000033] placeholder-[#00000080] text-[14px] focus:outline-none resize-none ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "focus:border-black focus:bg-white"
            }`}
            {...props}
          />
        ) : (
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
          className={`${className} w-full px-4 py-4 rounded-[100px] font-[400] border h-[48px] border-[#00000033] placeholder-[#00000080] text-[14px] focus:outline-none ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "focus:border-black focus:bg-white"
          }`}
          {...props}
        />
        )}
        {type === "password" && !isTextarea  && (
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
      {error && (
        <span className="text-[16px] text-red-500">
          {typeof error === "string" ? error : error.message}
        </span>
      )}
    </div>
  );
};