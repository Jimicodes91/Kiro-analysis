// components/ViewToggle.tsx
import React from "react";

interface ViewToggleProps {
  options: { label: string; value: string }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ options, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-[1px] border-[#00000033] justify-between items-center px-1 rounded-full">
      {options.map((option) => (
        <button
          key={option.value}
          className={`my-1 py-2 px-4 font-medium text-sm ${
            activeTab === option.value
              ? "text-white bg-primary rounded-full"
              : "text-[#00000066] hover:text-gray-500"
          }`}
          onClick={() => setActiveTab(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;
