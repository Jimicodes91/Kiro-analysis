import React, { useState } from "react";
import UserTab from "./User/index";
import DocumentTab from "./Document";
import EventTab from "./Event";
import TaskTab from "./Task";
import AuditTrailTab from "./AuditTrail";

type TabType = "User" | "Project" | "Document" | "Event" | "Note" | "Task" | "AuditTrail";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("User");

  const tabs: TabType[] = [
    "User",
    "Project",
    "Document",
    "Event",
    "Note",
    "Task",
    "AuditTrail",
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
        return <div> <DocumentTab /> </div>;
      case "Event":
        return <div> <EventTab /> </div>;
      case "Note":
        return <div className="p-4">Note</div>;
      case "Task":
        return <div> <TaskTab /> </div>;
      case "AuditTrail":
        return <div> <AuditTrailTab /> </div>;
      default:
        return;
    }
  };

  return (
    <>
      <h1 className="text-2xl font-[600] mb-6">Admin</h1>
      <div className="bg-white rounded-[6px] overflow-hidden border-[1.5px] border-[#0000001A]">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 text-[14px] text-black focus:outline-none transition-colors duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-black font-[600]"
                  : "opacity-30 hover:opacity-40 hover:bg-gray-50 font-[500]"
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

export default Admin;
