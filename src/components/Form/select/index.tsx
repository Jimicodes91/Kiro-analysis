import React, { useEffect, useRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { IoIosArrowDown } from "react-icons/io";
import "../../../index.css";

type FormSelectProps = {
  id?: string;
  label?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  className?: string;
  error?: string | { message?: string };
  register?: UseFormRegisterReturn;
  disabled?: boolean;
  value?: string | number;
  onChange?: (value: string | number) => void;
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(value);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update selected label when value or options change
  useEffect(() => {
    if (value !== undefined) {
      const option = options.find((opt) => opt.value === value);
      setSelectedValue(value);
      setSelectedLabel(option ? option.label : "");
    }
  }, [value, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle selection
  const handleSelect = (optionValue: string | number, optionLabel: string) => {
    setSelectedValue(optionValue);
    setSelectedLabel(optionLabel);
    setIsOpen(false);

    if (onChange) {
      onChange(optionValue);
    }

    // If using react-hook-form
    if (register && register.onChange) {
      const event = {
        target: { value: optionValue, name: register.name },
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      register.onChange(event);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative space-y-2" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="text-[16px] font-medium text-[#00000099]">
          {label}
        </label>
      )}

      {/* Custom select control */}
      <div
        className={`relative w-full px-4 py-3 rounded-[100px] font-[400] border h-[48px] border-[#00000033] text-[14px] flex items-center justify-between cursor-pointer ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:border-black hover:border-black"
        } ${className}`}
        onClick={toggleDropdown}
      >
        <div className={selectedValue ? "text-black" : "text-gray-400"}>
          {
            selectedLabel || placeholder || label
            // (label ? `Select ${label}` : "Select")
          }
        </div>
        <div className="flex items-center pointer-events-none">
          <IoIosArrowDown
            className={`h-5 w-5 text-black transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          />
        </div>

        {/* Hidden actual select - properly hidden with sr-only utility */}
        <select
          id={id}
          {...props}
          {...(register || {})}
          disabled={disabled}
          value={selectedValue}
          onChange={() => {}}
          className="sr-only"
          aria-hidden="true"
        >
          {(placeholder || label) && (
            <option value="">{placeholder ? placeholder : `Select ${label}`}</option>
          )}
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-brand-border rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-3 text-[14px] cursor-pointer transition-colors hover:bg-[#EAF1E980] ${
                  option.value === selectedValue ? "bg-[#EAF1E9] font-medium" : ""
                }`}
                onClick={() => handleSelect(option.value, option.label)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <span className="text-[16px] text-red-500">
          {typeof error === "string" ? error : error.message}
        </span>
      )}
    </div>
  );
};
