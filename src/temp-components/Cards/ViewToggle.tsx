// components/ViewToggle.tsx
import React from "react";

interface ViewToggleProps {
  options: { label: string; value: string }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ options, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-[1px] border-gray-200 justify-between items-center px-3 rounded-full">
      {options.map((option) => (
        <button
          key={option.value}
          className={`my-2 py-1 px-4 font-medium text-sm w-[129px] ${
            activeTab === option.value
              ? "text-white border-b-2 bg-primary rounded-full"
              : "text-gray-500 hover:text-gray-700"
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
