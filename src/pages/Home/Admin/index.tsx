import { motion } from "framer-motion";
import React from "react";
import { useSearchParams } from "react-router-dom";
import AuditTrailTab from "./audit-trail";
import DocumentTab from "./Document";
import EventTab from "./Event";
import JourneyTab from "./journey";
import NoteTab from "./note";
import SettingsTab from "./settings";
import TaskTab from "./task";
import UserTab from "./user";

const Admin: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get("selectedTab") || "user";

  const handleTabChange = (value: string) => {
    searchParams.delete("isCreateMode");
    searchParams.set("selectedTab", value?.toLowerCase());
    setSearchParams(searchParams);
  };
  const tabsList = [
    { text: "User", tab: "user" as const },
    { text: "Journey", tab: "journey" as const },
    { text: "Document type", tab: "document" as const },
    { text: "Event type", tab: "event" as const },
    { text: "Note type", tab: "note" as const },
    { text: "Task type", tab: "task" as const },
    { text: "Audit trail", tab: "audit-trail" as const },
    { text: "Account", tab: "account" as const },
    { text: "Settings", tab: "settings" as const },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "user":
        return (
          <div>
            <UserTab />
          </div>
        );
      case "journey":
        return (
          <div>
            <JourneyTab />
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
            <NoteTab />
          </div>
        );
      case "task":
        return (
          <div>
            <TaskTab />
          </div>
        );

      case "audit-trail":
        return (
          <div>
            <AuditTrailTab />
          </div>
        );
      case "settings":
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
      <div className="bg-white rounded-[6px] overflow-hidden border-[1.5px] border-brand-border">
        <div className="flex border-b border-gray-200">
          {tabsList.map((tab) => (
            <button
              key={tab.tab}
              className={`px-6 py-3 relative border-0 whitespace-nowrap outline-none text-[14px] text-black focus:outline-none transition-all duration-200 ${
                selectedTab === tab.tab
                  ? "font-bold"
                  : "opacity-30 hover:opacity-40 hover:bg-gray-50 font-[500]"
              }`}
              onClick={() => handleTabChange(tab.tab)}
            >
              {tab.text}
              {selectedTab === tab.tab ? (
                <motion.div
                  className="absolute bottom-0 left-0 rounded-full h-0.5 w-full bg-primary"
                  layoutId={`underline-admin-tabs`}
                  id="underline-admin-tabs"
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
