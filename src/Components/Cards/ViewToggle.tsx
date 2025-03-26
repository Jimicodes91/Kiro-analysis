// components/ViewToggle.tsx
import React from "react";

interface ViewToggleProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-[1px] border-gray-200 items-center px-3 rounded-full">
      <button
        className={`my-2 py-1 px-4 font-medium text-sm ${
          activeTab === "board"
            ? "text-white border-b-2 bg-primary rounded-full"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => setActiveTab("board")}
      >
        Board View
      </button>
      <button
        className={`my-2 py-1 px-4 font-medium text-sm ${
          activeTab === "table"
            ? "text-white border-b-2 bg-primary rounded-full"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => setActiveTab("table")}
      >
        Table View
      </button>
    </div>
  );
};

export default ViewToggle;