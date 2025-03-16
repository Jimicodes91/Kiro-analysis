import { UseFormRegisterReturn } from "react-hook-form";

type FormSelectProps = {
  id?: string;
  label?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  className?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  disabled?: boolean;
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
  ...props
}) => {
  return (
    <div className="relative space-y-2">
      {label && (
        <label htmlFor={id} className="text-[16px] font-medium text-black">
          {label}
        </label>
      )}
      <select
        id={id}
        {...props}
        {...register}
        disabled={disabled}
        className={`${className} w-full px-4 py-3 rounded-[100px] font-[400] border h-[48px] border-[#00000033] placeholder-[#00000080] text-[14px] focus:outline-none ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:border-gray-400 focus:bg-white"
        }`}
      >
        {placeholder || label && (
          <option value="" disabled>
            {placeholder ? placeholder : `Select ${label}`}
          </option>
        )}
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && <span className="text-[16px] text-red-500">{error}</span>}
    </div>
  );
};
