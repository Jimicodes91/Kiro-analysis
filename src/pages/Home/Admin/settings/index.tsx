import Heading from "@/components/ui/heading";
import { Switch } from "@/components/ui/switch";
import React from "react";

const SettingsTab: React.FC = () => {
  return (
    <>
      <div className="space-y-3 my-2">
        <h1 className="text-[16px] font-[600]">Settings</h1>

        <div className="border rounded-xl p-6 grid w-full max-w-6xl grid-cols-2 gap-4">
          <div>
            <Heading size="h5">Project settings</Heading>
            <p className="text-sm text-brand-text">
              A list of all tasks linked to the project, <br />
              including their status
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
              <Switch id="airplane-mode" />
              <div>
                <p className="text-lg font-bold">Task</p>
                <p className="text-sm text-[#00000066]">
                  A list of all tasks linked to the project, including their status
                </p>
              </div>
            </div>
            <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
              <Switch id="airplane-mode" />
              <div>
                <p className="text-lg font-bold">Notes</p>
                <p className="text-sm text-[#00000066]">
                  A list of all tasks linked to the project, including their status
                </p>
              </div>
            </div>

            <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
              <Switch id="airplane-mode" />
              <div>
                <p className="text-lg font-bold">Activity</p>
                <p className="text-sm text-[#00000066]">
                  A list of all tasks linked to the project, including their status
                </p>
              </div>
            </div>

            <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
              <Switch id="airplane-mode" />
              <div>
                <p className="text-lg font-bold">Document</p>
                <p className="text-sm text-[#00000066]">
                  A list of all tasks linked to the project, including their status
                </p>
              </div>
            </div>

            <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
              <Switch id="airplane-mode" />
              <div>
                <p className="text-lg font-bold">Message</p>
                <p className="text-sm text-[#00000066]">
                  A list of all tasks linked to the project, including their status
                </p>
              </div>
            </div>

            <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
              <Switch id="airplane-mode" />
              <div>
                <p className="text-lg font-bold">Event</p>
                <p className="text-sm text-[#00000066]">
                  A list of all tasks linked to the project, including their status
                </p>
              </div>
            </div>

            <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
              <Switch id="airplane-mode" />
              <div>
                <p className="text-lg font-bold">Project team</p>
                <p className="text-sm text-[#00000066]">
                  A list of all tasks linked to the project, including their status
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsTab;
