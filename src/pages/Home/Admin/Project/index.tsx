import { addProjectPipelineSchema } from "@/components/validationSchema/admin";
import useGetAllCompanies from "@/hooks/admin/use-get-all-companies";
import useCreateProjectType from "@/hooks/project-modules/project-types/use-create-project-type";
import { getUserSession } from "@/services/api.service";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BsThreeDotsVertical } from "react-icons/bs";
import { InferType } from "yup";
import ViewToggle from "../../../../components/Cards/ViewToggle";
import { MainButton } from "../../../../components/Form/button";
import { FormInput } from "../../../../components/Form/input";
import Modal from "../../../../components/Modal";
import Table from "../../../../components/Table";
import FormCustomization from "./Form";

interface ColumnDefinition<T, K extends keyof T> {
  key: K;
  header: string;
  width?: string;
  render?: (value: T[K], row: T) => React.ReactNode;
}
interface ProjectPipelineFormData {
  pipelineName: string;
}

//   interface StageFormData {
//     stageName: string;
//     duration: number;
//   }

interface Pipeline {
  id: number;
  pipelineName: string;
  duration: number;
  action: string;
}

const ProjectTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const session = getUserSession();
  const createProjectType = useCreateProjectType();
  useGetAllCompanies();

  //   Project pipeline form
  const {
    register: registerPipeline,
    handleSubmit: handleSubmitPipeline,
    formState: { errors: errorsPipeline },
    reset,
  } = useForm<ProjectPipelineFormData>({
    resolver: yupResolver(addProjectPipelineSchema),
  });

  // Stage form
  //   const {
  //     register: registerStage,
  //     handleSubmit: handleSubmitStage,
  //     formState: { errors: errorsStage },
  //   } = useForm({
  //     resolver: yupResolver(addStageSchema),
  //   });

  // Table data
  const pipelineData = [
    {
      id: 1,
      pipelineName: "Dubai Registration",
      duration: 10,
      action: "",
    },
    {
      id: 2,
      pipelineName: "Dubai Registration",
      duration: 10,
      action: "",
    },
    {
      id: 3,
      pipelineName: "Dubai Registration",
      duration: 10,
      action: "",
    },
  ];

  // Table columns
  const columns: ColumnDefinition<Pipeline, keyof Pipeline>[] = [
    {
      key: "pipelineName",
      header: "Pipeline name",
      width: "w-2/3",
    },
    {
      key: "duration",
      header: "Duration",
      width: "w-1/3",
      render: (value) => `${value} days`,
    },
  ];

  // Function to get sub-table data for each row
  const getSubTableData = (row: Pipeline) => {
    switch (row.id) {
      case 1:
        return [
          { stage: "Onboarding", duration: 2, action: "" },
          { stage: "Design", duration: 3, action: "" },
          { stage: "Development", duration: 5, action: "" },
        ];
      case 2:
        return [
          { stage: "Research", duration: 3, action: "" },
          { stage: "Prototyping", duration: 4, action: "" },
          { stage: "Testing", duration: 3, action: "" },
        ];
      case 3:
        return [
          { stage: "Planning", duration: 1, action: "" },
          { stage: "Implementation", duration: 6, action: "" },
          { stage: "Evaluation", duration: 3, action: "" },
        ];
      default:
        return [
          { stage: "Initial Setup", duration: 1, action: "" },
          { stage: "Execution", duration: 7, action: "" },
          { stage: "Review", duration: 2, action: "" },
        ];
    }
  };

  // Sub-table columns
  const subTableColumns = [
    { key: "stage", header: "Stages", width: "w-2/3" },
    {
      key: "duration",
      header: "Duration",
      // render: (value) => `${value} days`,
      width: "w-1/3",
    },
    { key: "action", header: "", render: () => <BsThreeDotsVertical /> },
  ];

  console.log(session);

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
          <MainButton onClick={() => setIsPipelineModalOpen(true)}>
            Create pipeline
          </MainButton>
        ) : (
          <MainButton>Publish</MainButton>
        )}
      </div>

      {activeTab === "pipeline" ? (
        <Table
          data={pipelineData}
          columns={columns}
          className="border-none"
          rowClassName="hover:bg-gray-50 transition-colors"
          expandable={true} // Enable expandable functionality
          subData={getSubTableData} // Pass row-specific sub-table data
          subColumns={subTableColumns} // Pass sub-table columns
        />
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
