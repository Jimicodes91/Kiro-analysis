import { addProjectPipelineSchema } from "@/components/validationSchema/admin";
import useGetAllCompanies from "@/hooks/admin/use-get-all-companies";
import useCreateProjectType from "@/hooks/project-modules/project-types/use-create-project-type";
import { getUserSession } from "@/services/api.service";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { InferType } from "yup";
import ViewToggle from "../../../../components/Cards/ViewToggle";
import { MainButton } from "../../../../components/Form/button";
import { FormInput } from "../../../../components/Form/input";
import Modal from "../../../../components/Modal";
import Table, { ColumnDefinition } from "../../../../components/Table";
import FormCustomization from "./Form";

interface ProjectPipelineFormData {
  pipelineName: string;
}

interface StageFormData {
  stageName: string;
  duration: string;
}

interface Pipeline {
  id: number;
  pipelineName: string;
  duration: number;
  action: string;
}

interface Stage {
  stage: string;
  duration: number;
  action: string;
}

const ProjectTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [activePipelineId, setActivePipelineId] = useState<number | null>(null);
  const [stageFormData, setStageFormData] = useState<StageFormData>({
    stageName: "",
    duration: "",
  });
  const [pipelineStages, setPipelineStages] = useState<Record<number, Stage[]>>({
    1: [
      { stage: "Onboarding", duration: 2, action: "" },
      { stage: "Design", duration: 3, action: "" },
      { stage: "Development", duration: 5, action: "" },
    ],
    2: [
      { stage: "Research", duration: 3, action: "" },
      { stage: "Prototyping", duration: 4, action: "" },
      { stage: "Testing", duration: 3, action: "" },
    ],
    3: [
      { stage: "Planning", duration: 1, action: "" },
      { stage: "Implementation", duration: 6, action: "" },
      { stage: "Evaluation", duration: 3, action: "" },
    ],
  });

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

  // Table data
  const pipelineData: Pipeline[] = [
    {
      id: 1,
      pipelineName: "Dubai Registration",
      duration: 27,
      action: "",
    },
    {
      id: 2,
      pipelineName: "Dubai Registration",
      duration: 27,
      action: "",
    },
    {
      id: 3,
      pipelineName: "Dubai Registration",
      duration: 27,
      action: "",
    },
    {
      id: 4,
      pipelineName: "Dubai Registration",
      duration: 27,
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

  // Handle stage form input changes
  const handleStageInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof StageFormData
  ) => {
    setStageFormData({
      ...stageFormData,
      [field]: e.target.value,
    });
  };

  // Function to add a new stage
  const handleAddStage = (pipelineId: number) => {
    if (stageFormData.stageName && stageFormData.duration) {
      const newStage: Stage = {
        stage: stageFormData.stageName,
        duration: parseInt(stageFormData.duration, 10),
        action: "",
      };

      setPipelineStages({
        ...pipelineStages,
        [pipelineId]: [...(pipelineStages[pipelineId] || []), newStage],
      });

      // Reset the form
      setStageFormData({ stageName: "", duration: "" });
      setActivePipelineId(null);
    }
  };

  // Function to handle cancel button
  const handleCancel = () => {
    setStageFormData({ stageName: "", duration: "" });
    setActivePipelineId(null);
  };

  // Function to get sub-table data for each row
  const getSubTableData = (row: Pipeline): Stage[] => {
    return pipelineStages[row.id] || [];
  };

  // Sub-table columns
  const subTableColumns: ColumnDefinition<Stage, keyof Stage>[] = [
    { key: "stage", header: "Stages", width: "w-2/3" },
    {
      key: "duration",
      header: "Duration",
      render: (value) => `${value} days`,
      width: "w-1/3",
    },
    {
      key: "action",
      header: "",
      width: "w-10",
      render: () => <BsThreeDotsVertical className="cursor-pointer" />,
    },
  ];

  // Custom render function for the sub table to include the add stage form
  const renderSubTable = (
    row: Pipeline,
    data: Stage[],
    columns: ColumnDefinition<Stage, keyof Stage>[]
  ): React.ReactNode => {
    const isActiveForm = activePipelineId === row.id;
    const isFormValid =
      stageFormData.stageName.trim() !== "" && stageFormData.duration.trim() !== "";

    return (
      <div className="m-4 border rounded-lg overflow-hidden">
        <table className="min-w-full table-fixed">
          <thead className="border-b border-[#0000001A]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`sub-header-${index}`}
                  className={`bg-[#F9F9F9] p-4 text-left font-[600] text-[14px] ${column.width || ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((stageRow, rowIndex) => (
              <tr key={`sub-row-${rowIndex}`} className="bg-white">
                {columns.map((column, colIndex) => {
                  const key = column.key;
                  return (
                    <td
                      key={`sub-cell-${rowIndex}-${colIndex}`}
                      className={`p-4 text-[14px] ${column.width || ""}`}
                    >
                      {column.render
                        ? column.render(stageRow[key], stageRow)
                        : (stageRow[key] as React.ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))}
            {isActiveForm && (
              <tr>
                <td colSpan={columns.length} className="p-0 border-t">
                  <div className="flex items-center p-4">
                    <div className="flex flex-1 space-x-2">
                      <input
                        type="text"
                        placeholder="Stage name"
                        className="py-2 px-4 border rounded-full w-1/4 text-[14px]"
                        value={stageFormData.stageName}
                        onChange={(e) => handleStageInputChange(e, "stageName")}
                      />
                      <div className="w-2/4"></div>
                      <input
                        type="text"
                        placeholder="Duration"
                        className="py-2 px-4 border rounded-full w-1/4 text-[14px]"
                        value={stageFormData.duration}
                        onChange={(e) => handleStageInputChange(e, "duration")}
                      />
                    </div>
                    <div className="flex space-x-2 ml-2">
                      <button
                        className="px-4 py-1 text-sm border border-black text-black rounded-full bg-white"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        className={`px-4 py-1 text-sm rounded-full ${
                          isFormValid
                            ? "bg-black text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => isFormValid && handleAddStage(row.id)}
                        disabled={!isFormValid}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="p-4 pb-6">
          <div className="flex items-center">
            <button
              onClick={() => setActivePipelineId(row.id)}
              className={`flex items-center text-sm font-semibold ${
                isActiveForm
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black hover:text-primary"
              }`}
              disabled={isActiveForm}
            >
              <span className="mr-1 text-xl">
                <IoAdd className={isActiveForm ? "text-gray-400" : "text-black"} />
              </span>
              Add stage
            </button>
            {/* Line beside the button */}
            <div className="flex-grow border-t border-gray-200 ml-4"></div>
          </div>
        </div>
      </div>
    );
  };

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
        <div className="border-[1px] border-[#0000001A] p-1 rounded-lg bg-brand-table">
          <Table<Pipeline, keyof Pipeline, Stage, keyof Stage>
            data={pipelineData}
            columns={columns}
            className="border-none"
            rowClassName="hover:bg-gray-50 transition-colors"
            expandable={true}
            subData={getSubTableData}
            subColumns={subTableColumns}
            customSubTableRender={renderSubTable}
          />
        </div>
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
