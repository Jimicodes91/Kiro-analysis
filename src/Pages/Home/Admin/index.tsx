import React, { useState } from "react";
import UserTab from "./User";

type TabType = "User" | "Project" | "Document" | "Event" | "Note" | "Task";

const TabsComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("User");

  const tabs: TabType[] = [
    "User",
    "Project",
    "Document",
    "Event",
    "Note",
    "Task",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "User":
        return (
          <div>
            <UserTab />
          </div>
        );
      case "Project":
        return <div className="p-4">Project</div>;
      case "Document":
        return <div className="p-4">Document </div>;
      case "Event":
        return <div className="p-4">Event </div>;
      case "Note":
        return <div className="p-4">Note</div>;
      case "Task":
        return <div className="p-4">Task</div>;
      default:
        return;
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary "
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </>
  );
};

export default TabsComponent;
