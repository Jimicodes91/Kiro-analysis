import { Button } from "@/components/ui/button";
import { addProjectPipelineSchema } from "@/components/validationSchema/admin";
import useGetAllCompanies from "@/hooks/admin/use-get-all-companies";
import useCreateProjectType from "@/hooks/project-modules/project-types/use-create-project-type";
import { getUserSession } from "@/services/api.service";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import ViewToggle from "../../../../components/Cards/ViewToggle";
import { MainButton } from "../../../../components/Form/button";
import { FormInput } from "../../../../components/Form/input";
import Modal from "../../../../components/Modal";
import FormCustomization from "./Form";
import PipeLineTable from "./pipeline-table";

interface ProjectPipelineFormData {
  pipelineName: string;
}

const ProjectTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

  const session = getUserSession();
  const createProjectType = useCreateProjectType();
  useGetAllCompanies();

  // Project pipeline form
  const {
    register: registerPipeline,
    handleSubmit: handleSubmitPipeline,
    formState: { errors: errorsPipeline },
    reset,
  } = useForm<ProjectPipelineFormData>({
    resolver: yupResolver(addProjectPipelineSchema),
  });

  // Function to add a new stage

  // Custom render function for the sub table to include the add stage form
  // const renderSubTable = (
  //   row: Pipeline,
  //   data: Stage[],
  //   columns: ColumnDefinition<Stage, keyof Stage>[]
  // ): React.ReactNode => {
  //   const isActiveForm = activePipelineId === row.id;
  //   const isFormValid =
  //     stageFormData.stageName.trim() !== "" && stageFormData.duration.trim() !== "";

  //   return (
  //     <div className="m-4 border rounded-lg overflow-hidden">
  //       <div className="p-4 pb-6">
  //         <div className="flex items-center">
  //           <button
  //             onClick={() => setActivePipelineId(row.id)}
  //             className={`flex items-center text-sm font-semibold ${
  //               isActiveForm
  //                 ? "text-gray-400 cursor-not-allowed"
  //                 : "text-black hover:text-primary"
  //             }`}
  //             disabled={isActiveForm}
  //           >
  //             <span className="mr-1 text-xl">
  //               <IoAdd className={isActiveForm ? "text-gray-400" : "text-black"} />
  //             </span>
  //             Add stage
  //           </button>
  //           {/* Line beside the button */}
  //           <div className="flex-grow border-t border-gray-200 ml-4"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const onSubmitPipeline = async (data: InferType<typeof addProjectPipelineSchema>) => {
    createProjectType
      .mutateAsync({
        name: data.pipelineName,
        company_id: session?.company_id ?? "",
      })
      .then(() => {
        reset();
        setIsPipelineModalOpen(false);
      })
      .catch(console.error);
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
        <Modal
          title="Create pipeline"
          closeModal={() => setIsPipelineModalOpen(false)}
          fullHeight={false}
        >
          <form
            onSubmit={handleSubmitPipeline(onSubmitPipeline)}
            className="flex flex-col gap-4 p-4"
          >
            <FormInput
              label="Pipeline name"
              placeholder="Pipeline name"
              {...registerPipeline("pipelineName")}
              error={errorsPipeline.pipelineName?.message}
            />

            <MainButton modalButton type="submit" isLoading={createProjectType.isPending}>
              Create pipeline
            </MainButton>
          </form>
        </Modal>
      )}
    </>
  );
};

export default ProjectTab;
