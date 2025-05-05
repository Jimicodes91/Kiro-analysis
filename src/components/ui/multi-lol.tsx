import Select, {
  CSSObjectWithLabel,
  OnChangeValue,
  PropsValue,
  StylesConfig,
} from "react-select";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  placeholder: string;
  value?: PropsValue<Option> | undefined;
  options?: Option[];
  isLoading?: boolean;
  onChange: (newValue: OnChangeValue<Option, true>) => void;
  isMulti?: true;
}

const CustomMultiSelect = ({
  placeholder,
  onChange,
  value,
  isLoading = false,
  options,
  isMulti,
}: MultiSelectProps) => {
  const customStyles: StylesConfig<Option, true> = {
    control: (provided) => ({
      ...provided,
      outline: "none",
      // background: hasError && !value ? "#fed7d7" : "transparent",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      minHeight: "48px",
      cursor: "pointer",
      borderRadius: "100px",
      border: "0px solid transparent",
      fontSize: "0.8rem",
    }),
    multiValue: (provided: CSSObjectWithLabel) => ({
      ...provided,
      borderRadius: "20px",
      background: "#092428",
      color: "#fff",
      overflow: "hidden",
      padding: "3px",
      fontSize: "1rem",
    }),
    multiValueLabel: (base) => ({
      ...base,
      textTransform: "capitalize",
      color: "#fff",
    }),
    container: (provided, state) => ({
      ...provided,
      border: `1.5px solid ${state.isFocused ? "#092428" : "#0000001A"}`,
      borderRadius: "100px",
      cursor: "pointer",
    }),
    valueContainer: (base) => ({
      ...base,
      fontSize: "0.85rem",
    }),
    option: (_styles, state) => ({
      padding: "8px",
      fontSize: "0.9rem",
      cursor: "pointer",
      textTransform: "capitalize",
      background: state.isSelected ? "#00000014" : state.isFocused ? "#0000001A" : "#fff",
      color: "#092428",
    }),
    placeholder: (styles) => {
      return {
        ...styles,
        color: "#00000080",
        fontSize: "0.85rem",
      };
    },
  };

  return (
    <div>
      <div>
        <Select
          value={value}
          isMulti={isMulti}
          onChange={onChange}
          styles={customStyles}
          isLoading={isLoading}
          options={options}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default CustomMultiSelect;
