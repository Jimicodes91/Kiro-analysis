import { motion } from "framer-motion";
import React, { useState } from "react";
import AuditTrailTab from "./AuditTrail";
import DocumentTab from "./Document";
import EventTab from "./Event";
import ProjectTab from "./Project";
import SettingsTab from "./Settings";
import TaskTab from "./Task";
import UserTab from "./User/index";

type TabType =
  | "User"
  | "Project"
  | "Document"
  | "Event"
  | "Note"
  | "Task"
  | "AuditTrail"
  | "Account"
  | "Settings";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("User");

  const tabs: TabType[] = [
    "User",
    "Project",
    "Document",
    "Event",
    // "Note",
    "Task",
    "AuditTrail",
    // "Account",
    "Settings",
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
        return (
          <div>
            <ProjectTab />
          </div>
        );
      case "Document":
        return (
          <div>
            <DocumentTab />
          </div>
        );
      case "Event":
        return (
          <div>
            <EventTab />
          </div>
        );
      case "Task":
        return (
          <div>
            <TaskTab />
          </div>
        );
      case "AuditTrail":
        return (
          <div>
            <AuditTrailTab />
          </div>
        );
      case "Settings":
        return (
          <div>
            <SettingsTab />
          </div>
        );
      default:
        return;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-[600] mb-6">Admin</h1>
      <div className="bg-white rounded-[6px] overflow-hidden border-[1.5px] border-[#0000001A]">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 relative text-[14px] text-black focus:outline-none transition-all duration-200 ${
                activeTab === tab
                  ? "font-bold"
                  : "opacity-30 hover:opacity-40 hover:bg-gray-50 font-[500]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {activeTab === tab ? (
                <motion.div
                  className="absolute bottom-0 left-0 rounded-full h-1 w-full bg-primary"
                  layoutId={`underline-admin`}
                  id="underline"
                />
              ) : null}
            </button>
          ))}
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Admin;
