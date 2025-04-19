import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ViewToggle from "../../../../components/Cards/ViewToggle";
import FormCustomization from "./Form";
import PipelineForm from "./lol";
import PipeLineTable from "./pipeline-table";

const ProjectTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [searchParams, setSearchParams] = useSearchParams();
  const isCreateMode = searchParams.get("isCreateMode");
  const isOpen = Boolean(isCreateMode);

  const onClose = () => {
    searchParams.delete("isCreateMode");
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const onOpen = () => {
    searchParams.set("isCreateMode", "1");
    setSearchParams(searchParams);
  };

  return (
    <>
      <div className="flex justify-between items-center my-2">
        <ViewToggle
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          options={[
            { value: "pipeline", label: "Pipeline" },
            { value: "form", label: "Form customisation " },
          ]}
        />
        {activeTab === "pipeline" ? (
          <Button onClick={onOpen}>Create pipeline</Button>
        ) : (
          <Button>Publish</Button>
        )}
      </div>

      {activeTab === "pipeline" ? (
        <PipeLineTable />
      ) : (
        <div className="bg-[#F4F4F4] py-4 rounded-[10px] border border-[#0000001A]">
          <FormCustomization />
        </div>
      )}
      <AnimatePresence
        // Disable any initial animations on children that
        // are present when the component is first rendered
        initial={false}
        // Only render one component at a time.
        // The exiting component will finish its exit
        // animation before entering component is rendered
        mode="wait"
        // Fires when all exiting nodes have completed animating out
        onExitComplete={() => null}
      >
        {/* Modal to add project pipeline */}
        {isOpen && <PipelineForm onClose={onClose} />}
      </AnimatePresence>
    </>
  );
};

export default ProjectTab;
