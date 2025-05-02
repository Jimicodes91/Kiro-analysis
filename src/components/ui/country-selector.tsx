export type Country = {
  code: string;
  dialCode: string;
  flag: string;
};

export const countries: Country[] = [
  { code: "US", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { code: "NG", dialCode: "+234", flag: "🇳🇬" },
  { code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { code: "KE", dialCode: "+254", flag: "🇰🇪" },
  // Add more countries as needed
];

interface CountrySelectorProps {
  value: string;
  onChange: (dialCode: string) => void;
  disabled?: boolean;
}

export const CountrySelector = ({
  value,
  onChange,
  disabled = false,
}: CountrySelectorProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="h-full border-r border-gray-300 bg-transparent pr-2 focus:outline-none text-sm [&>option]:text-base"
    >
      {countries.map((country) => (
        <option key={country.code} value={country.dialCode}>
          {country.flag}
        </option>
      ))}
    </select>
  );
};
