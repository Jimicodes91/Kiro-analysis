import Select, { OnChangeValue, PropsValue, StylesConfig } from "react-select";

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
}

const CustomMultiSelect = ({
  placeholder,
  onChange,
  value,
  isLoading = false,
  options,
}: MultiSelectProps) => {
  const customStyles: StylesConfig<Option, true> = {
    control: (provided) => ({
      ...provided,
      outline: "none",
      // background: hasError && !value ? "#fed7d7" : "transparent",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      height: "38px",
      borderRadius: "6px",
      border: "0px solid transparent",
      fontSize: "0.8rem",
    }),
    //   container: (provided, state) => ({
    container: (provided) => ({
      ...provided,
      border: `1.2px solid ${
        //   hasError && !value ? "#FC8181" : `${state.isFocused ? "#ADB1D9" : "#ADB1D9"}`
        ""
      }`,
      borderRadius: "6px",
      cursor: "pointer",
    }),

    option: (styles, state) => ({
      ...styles,
      fontSize: "0.8rem",
      cursor: "pointer",
      textTransform: "capitalize",
      background: state.isSelected ? "#E5C05C" : "",
      color: state.isSelected ? "#222" : "#3E4095",
    }),
    placeholder: (styles) => {
      return {
        ...styles,
        color: "#8787A8",
      };
    },
  };

  return (
    <div>
      <div>
        <Select
          value={value}
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
