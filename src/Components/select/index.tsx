import { UseFormRegisterReturn } from "react-hook-form";
import type { ChangeEvent, FocusEvent } from "react";

type FormSelectProps = {
  id?: string;
  value?: string;
  onFocus?: (e: FocusEvent<HTMLSelectElement>) => void;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  disabled?: boolean;
  options: { value: string; label: string }[];
};

const FormSelect: React.FC<FormSelectProps> = ({
  id,
  value,
  onFocus,
  onChange,
  placeholder,
  className = "",
  register,
  error,
  disabled = false,
  options,
  label,
}) => {
  return (
    <div className="relative max-w-[460px] space-y-2">
      <label htmlFor={id} className="text-base font-medium text-black">
        {label ? label : placeholder}
      </label>
      <select
        id={id}
        value={value}
        {...register}
        onFocus={onFocus}
        onChange={onChange}
        disabled={disabled}
        className={`${className} w-full max-w-[460px] px-4 py-4 rounded-[100px] font-medium border h-[48px] border-gray-200 text-[16px] focus:outline-none bg-white $ {
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:border-gray-400"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default FormSelect;
