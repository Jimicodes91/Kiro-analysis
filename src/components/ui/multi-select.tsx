import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  disabled?: boolean;
  error?: string; // Add error prop
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
  checkboxSize = 18,
  disabled = false,
  error, // Add error prop
}: MultiSelectProps) => {
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);

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
      {!disabled && (
        <div
          className={`flex items-center justify-between w-full px-4 py-3 text-left border rounded-full ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-pointer"}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="text-[#00000080] text-sm font-[400]">{placeholder}</div>
          {!disabled && <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <div
                key={option.value}
                className={`flex items-center px-3 py-2 text-sm font-[400] ${
                  disabled ? "cursor-not-allowed" : "hover:bg-[#E0EFDE4D] cursor-pointer"
                }`}
                onClick={() => !disabled && toggleItem(option.value)}
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
      {!disabled && selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedItems.map((item) => (
            <div key={item.value} className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-md bg-[#F1F1F1] border-2 border-[#E0E0E0] font-semibold">
                  {getInitials(item.label)}
                </AvatarFallback>
              </Avatar>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => removeItem(item.value, e)}
                  className="absolute -top-1 -right-1 bg-[#C0C0C0] border border-white rounded-full p-0.5 flex items-center justify-center"
                  aria-label={`Remove ${item.label}`}
                >
                  <X className="h-3 w-3 text-[#0A1B41]" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
