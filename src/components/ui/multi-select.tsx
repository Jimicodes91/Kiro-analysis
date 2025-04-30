import { Check, ChevronDown, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Types
type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  checkboxSize?: number;
};

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const MultiSelect = ({
  options,
  defaultSelected = [],
  onChange,
  placeholder = "Assign to",
  className = "",
  checkboxSize = 20,
}: MultiSelectProps) => {
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleItem = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const removeItem = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = selected.filter((item) => item !== value);
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get selected items details
  const selectedItems = selected
    .map((value) => options.find((option) => option.value === value))
    .filter(Boolean) as Option[];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Field */}
      <div
        className="flex items-center justify-between w-full px-4 py-3 text-left border rounded-full cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-gray-500">{placeholder}</div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <div
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleItem(option.value)}
              >
                <div className="flex-1">{option.label}</div>
                <div
                  className={`flex items-center justify-center border rounded ${isSelected ? "bg-black border-black" : "border-gray-500"}`}
                  style={{ width: `${checkboxSize}px`, height: `${checkboxSize}px` }}
                >
                  {isSelected && (
                    <Check
                      className="text-white"
                      style={{
                        width: `${checkboxSize - 4}px`,
                        height: `${checkboxSize - 4}px`,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Items Display */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedItems.map((item) => (
            <div
              key={item.value}
              className="flex items-center bg-gray-100 rounded-full px-3 py-1"
            >
              <div
                className="flex items-center justify-center w-6 h-6 mr-1 text-xs font-medium bg-gray-200 rounded-full relative group"
                title={item.label}
              >
                {getInitials(item.label)}
                <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </div>
              </div>
              <button
                className="ml-1 p-1 rounded-full hover:bg-gray-200"
                onClick={(e) => removeItem(item.value, e)}
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
