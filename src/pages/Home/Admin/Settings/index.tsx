import React, { useState } from "react";

interface SettingOption {
  id: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

const SettingsTab: React.FC = () => {
  const settingOptions: SettingOption[] = [
    {
      id: "task",
      label: "Task",
      description: "A list of all tasks linked to the project, including their status.",
      defaultValue: true,
    },
    {
      id: "notes",
      label: "Notes",
      description: "A list of all tasks linked to the project, including their status.",
      defaultValue: true,
    },
    {
      id: "activity",
      label: "Activity",
      description: "A list of all tasks linked to the project, including their status.",
      defaultValue: true,
    },
    {
      id: "document",
      label: "Document",
      description: "A list of all tasks linked to the project, including their status.",
      defaultValue: true,
    },
    {
      id: "message",
      label: "Message",
      description: "A list of all tasks linked to the project, including their status.",
      defaultValue: true,
    },
    {
      id: "event",
      label: "Event",
      description: "A list of all tasks linked to the project, including their status.",
      defaultValue: true,
    },
    {
      id: "project-team",
      label: "Project team",
      description: "A list of all tasks linked to the project, including their status.",
      defaultValue: true,
    },
  ];

  const [settings, setSettings] = useState<Record<string, boolean>>(
    settingOptions.reduce(
      (acc, option) => ({
        ...acc,
        [option.id]: option.defaultValue,
      }),
      {}
    )
  );

  const handleToggle = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="">
      <h1 className="text-[16px] font-[600] text-black mb-4">Settings</h1>

      <div className="bg-white p-4 rounded-[10px] border border-brand-border flex flex-row gap-52">
        <div className="space-y-1">
          <div className="text-[16px] font-semibold mb-1 text-[#191819]">
            Project setting
          </div>
          <div className="text-sm font-medium text-[#00000066] mb-4">
            A list of all tasks linked to the project,
            <br /> including their status.
          </div>
        </div>

        <div className="space-y-4">
          {settingOptions.map((option) => (
            <div
              key={option.id}
              className="flex justify-between items-start border-b pb-4 gap-4"
            >
              {/* Switch */}
              <div className="mt-1">
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    settings[option.id] ? "bg-primary" : "bg-gray-200"
                  }`}
                  onClick={() => handleToggle(option.id)}
                  role="switch"
                  aria-checked={settings[option.id]}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[option.id] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {/* Label */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-[#191819]">{option.label}</div>
                <div className="text-xs text-[#00000066]">{option.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
