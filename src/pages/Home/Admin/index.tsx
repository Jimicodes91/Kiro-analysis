import { motion } from "framer-motion";
import React from "react";
import { useSearchParams } from "react-router-dom";
import DocumentTab from "./Document";
import EventTab from "./Event";
import ProjectTab from "./Project";
import TaskTab from "./Task";
import UserTab from "./User/index";

type TabType = "User" | "Pipeline" | "Document" | "Event" | "Note" | "Task";

const Admin: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get("selectedTab") || "user";

  const handleTabChange = (value: string) => {
    searchParams.set("selectedTab", value?.toLowerCase());
    setSearchParams(searchParams);
  };

  const tabs: TabType[] = ["User", "Pipeline", "Document", "Event", "Note", "Task"];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "user":
        return (
          <div>
            <UserTab />
          </div>
        );
      case "pipeline":
        return (
          <div>
            <ProjectTab />
          </div>
        );
      case "document":
        return (
          <div>
            <DocumentTab />
          </div>
        );
      case "event":
        return (
          <div>
            <EventTab />
          </div>
        );
      case "note":
        return (
          <div>
            <p>Note Tab</p>
          </div>
        );
      case "task":
        return (
          <div>
            <TaskTab />
          </div>
        );

      default:
        return;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-[600] mb-6">Admin</h1>
      <div className="bg-white rounded-[6px] overflow-hidden border-[1.5px] border-brand-border">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 relative text-[14px] text-black focus:outline-none transition-all duration-200 ${
                selectedTab === tab.toLowerCase()
                  ? "font-bold"
                  : "opacity-30 hover:opacity-40 hover:bg-gray-50 font-[500]"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
              {selectedTab === tab.toLowerCase() ? (
                <motion.div
                  className="absolute bottom-0 left-0 rounded-full h-0.5 w-full bg-primary"
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
