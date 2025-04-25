import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ViewToggle from "../../../../components/ui/view-toggle";
import FormCustomization from "./Form";
import JourneyTable from "./journey-table";
import PipelineForm from "./lol";

const JourneyTab: React.FC = () => {
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
            { value: "pipeline", label: "Journey" },
            { value: "form", label: "Form customisation " },
          ]}
        />
        {activeTab === "pipeline" ? (
          <Button size="sm" onClick={onOpen}>
            Create journey
          </Button>
        ) : (
          <Button>Publish</Button>
        )}
      </div>

      {activeTab === "pipeline" ? (
        <JourneyTable />
      ) : (
        <div className="bg-[#F4F4F4] py-4 rounded-[10px] border border-brand-border">
          <FormCustomization />
        </div>
      )}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {/* Modal to add project pipeline */}
        {isOpen && <PipelineForm onClose={onClose} />}
      </AnimatePresence>
    </>
  );
};

export default JourneyTab;
