import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ViewToggle from "../../../../components/Cards/ViewToggle";
import FormCustomization from "./Form";
import PipelineForm from "./lol";
import PipeLineTable from "./pipeline-table";

const ProjectTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

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
          <Button onClick={() => setIsPipelineModalOpen(true)}>Create pipeline</Button>
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

      {/* Modal to add project pipeline */}
      {isPipelineModalOpen && (
        <PipelineForm onClose={() => setIsPipelineModalOpen(false)} />
      )}
    </>
  );
};

export default ProjectTab;
