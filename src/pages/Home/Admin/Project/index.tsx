import { Button } from "@/components/ui/button";
import useGetAllCompanies from "@/hooks/admin/use-get-all-companies";
import useCreateProjectType from "@/hooks/project-modules/project-types/use-create-project-type";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import { InferType } from "yup";
import ViewToggle from "../../../../components/Cards/ViewToggle";
import { MainButton } from "../../../../components/Form/button";
import { FormInput } from "../../../../components/Form/input";
import { FormSelect } from "../../../../components/Form/select";
import Modal from "../../../../components/Modal";
import Table from "../../../../components/Table";
import {
  addMilestoneSchema,
  addProjectTypeSchema,
  addStepSchema,
} from "../../../../components/validationSchema/admin";

interface ColumnDefinition<T, K extends keyof T> {
  key: K;
  header: string;
  width?: string;
  render?: (value: T[K], row: T) => React.ReactNode;
}

// Interfaces for the form data
// interface ProjectTypeFormData {
//     projectName: string;
//     assignTo: "consultant" | "client" | "customer";
//     billingType: "consultant" | "client" | "customer";
//   }

//   interface StepFormData {
//     stepName: string;
//     duration: number;
//     assignTo: "consultant" | "client" | "customer";
//   }

//   interface MilestoneFormData {
//     milestoneName: string;
//     duration: number;
//     assignTo: "consultant" | "client" | "customer";
//   }

interface Project {
  id: number;
  phase: string;
  milestone: string;
  steps: number;
  duration: number;
  date: string;
}

const ProjectTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [loadingMilestone, setLoadingMilestone] = useState(false);
  const [loadingStep, setLoadingStep] = useState(false);
  const createProjectType = useCreateProjectType();
  useGetAllCompanies();
  const project = [
    {
      id: 1,
      phase: "Onboarding",
      milestone: "Pretravel",
      steps: 6,
      duration: 8,
      date: "02 Nov 2023",
    },
    {
      id: 2,
      phase: "Licensing",
      milestone: "Pretravel",
      steps: 6,
      duration: 8,
      date: "02 Nov 2023",
    },
    {
      id: 3,
      phase: "Permit",
      milestone: "Pretravel",
      steps: 6,
      duration: 8,
      date: "02 Nov 2023",
    },
    {
      id: 4,
      phase: "Travel",
      milestone: "Pretravel",
      steps: 6,
      duration: 8,
      date: "02 Nov 2023",
    },
  ];

  // Project type form
  const {
    register: registerType,
    handleSubmit: handleSubmitType,
    formState: { errors: errorsType },
  } = useForm({
    resolver: yupResolver(addProjectTypeSchema),
  });

  // Step form
  const {
    register: registerStep,
    handleSubmit: handleSubmitStep,
    formState: { errors: errorsStep },
    reset,
  } = useForm({
    resolver: yupResolver(addStepSchema),
  });

  // Milestone form
  const {
    register: registerMilestone,
    handleSubmit: handleSubmitMilestone,
    formState: { errors: errorsMilestone },
  } = useForm({
    resolver: yupResolver(addMilestoneSchema),
  });

  const columns: ColumnDefinition<Project, keyof Project>[] = [
    {
      key: "phase",
      header: "Phase",
      width: "w-1/5",
    },
    {
      key: "milestone",
      header: "Milestone",
      width: "w-1/5",
    },
    {
      key: "steps",
      header: "Steps",
      width: "w-1/5",
    },
    {
      key: "duration",
      header: "Duration (days)",
      width: "w-1/5",
    },
    {
      key: "date",
      header: "",
      width: "w-1/5",
    },
  ];

  const onSubmitType = async (data: InferType<typeof addProjectTypeSchema>) => {
    createProjectType
      .mutateAsync({
        name: data.projectName,
      })
      .then(() => {
        reset();
        setIsTypeModalOpen(false);
      })
      .catch(console.error);
  };

  const onSubmitStep = async () => {
    setLoadingStep(true);
    try {
      // Your API call or actions here
      setIsStepModalOpen(false);
    } catch (error) {
      console.error(`Failed to add step:`, error);
    } finally {
      setLoadingStep(false);
    }
  };

  const onSubmitMilestone = async () => {
    setLoadingMilestone(true);
    try {
      // Your API call or actions here
      setIsMilestoneModalOpen(false);
    } catch (error) {
      console.error(`Failed to add milestone:`, error);
    } finally {
      setLoadingMilestone(false);
    }
  };

  // Function to get sub-table data for each row
  const getSubTableData = () => {
    // Return specific sub-table data based on row
    return [
      { item: "Item A", quantity: 10, price: 5 },
      { item: "Item B", quantity: 20, price: 7 },
    ];
  };

  // Function to get sub-table columns for each row
  const getSubTableColumns = () => {
    // Return specific columns for the sub-table based on row
    return [
      { key: "item", header: "Item" },
      { key: "quantity", header: "Quantity" },
      { key: "price", header: "Price" },
    ];
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <ViewToggle
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          options={[
            { value: "table", label: "Project type" },
            { value: "form", label: "Project form" },
          ]}
        />
        <div className="flex justify-between space-x-2">
          <FormSelect
            value={"dubai"}
            options={[{ value: "dubai", label: "Dubai Registration" }]}
          />
          <MainButton onClick={() => setIsTypeModalOpen(true)}>
            {" "}
            <span className="mr-3 text-xl">
              <IoAdd className="text-white" />
            </span>
            Add project type
          </MainButton>
        </div>
      </div>

      <div className="border-[1px] border-[#0000001A] rounded-lg mt-4 p-4">
        {activeTab === "table" ? (
          <>
            <div className="flex justify-between items-center my-2">
              <h1 className="text-[16px] font-[600]">Milestone </h1>
              <MainButton
                variant="outlined"
                onClick={() => setIsMilestoneModalOpen(true)}
              >
                Create milestone
              </MainButton>
            </div>
            <Table
              data={project}
              columns={columns}
              className="border-none"
              rowClassName="hover:bg-gray-50 transition-colors"
              expandable={true} // Enable expandable functionality
              subData={getSubTableData} // Pass row-specific sub-table data
              subColumns={getSubTableColumns} // Pass row-specific sub-table columns
            />
          </>
        ) : (
          <div> Form </div>
        )}
      </div>

      {/* Modal to add project type */}
      {isTypeModalOpen && (
        <Modal
          title="Create Pipeline"
          closeModal={() => setIsTypeModalOpen(false)}
          fullHeight={false}
        >
          <form
            onSubmit={handleSubmitType(onSubmitType)}
            className="flex flex-col gap-4 p-4"
          >
            <FormInput
              label="Project name"
              placeholder="Project name"
              {...registerType("projectName")}
              error={errorsType.projectName?.message}
            />

            <Button type="submit" isLoading={createProjectType.isPending}>
              Create Pipeline
            </Button>
          </form>
        </Modal>
      )}

      {/* Modal to add step */}
      {isStepModalOpen && (
        <Modal
          title="Add step"
          closeModal={() => setIsStepModalOpen(false)}
          fullHeight={false}
        >
          <form
            onSubmit={handleSubmitStep(onSubmitStep)}
            className="flex flex-col gap-4 p-4"
          >
            <FormInput
              label="Step name"
              placeholder="Step name"
              {...registerStep("stepName")}
              error={errorsStep.stepName?.message}
            />
            <FormSelect
              label="Duration (days)"
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
              register={registerStep("duration")}
              error={errorsStep.duration?.message}
            />
            <FormSelect
              label="Assign to"
              options={[
                { value: "consultant", label: "Consultant" },
                { value: "client", label: "Client" },
                { value: "customer", label: "Customer" },
              ]}
              register={registerStep("assignTo")}
              error={errorsStep.assignTo?.message}
            />
            <MainButton type="submit" isLoading={loadingStep}>
              Add step
            </MainButton>
          </form>
        </Modal>
      )}

      {/* Modal to add milestone */}
      {isMilestoneModalOpen && (
        <Modal
          title="Add milestone"
          closeModal={() => setIsMilestoneModalOpen(false)}
          fullHeight={false}
        >
          <form
            onSubmit={handleSubmitMilestone(onSubmitMilestone)}
            className="flex flex-col gap-4 p-4"
          >
            <FormInput
              label="Milestone name"
              placeholder="Milestone name"
              {...registerMilestone("milestoneName")}
              error={errorsMilestone.milestoneName?.message}
            />
            <FormSelect
              label="Duration (days)"
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
              register={registerMilestone("duration")}
              error={errorsMilestone.duration?.message}
            />
            <FormSelect
              label="Assign to"
              options={[
                { value: "consultant", label: "Consultant" },
                { value: "client", label: "Client" },
                { value: "customer", label: "Customer" },
              ]}
              register={registerMilestone("assignTo")}
              error={errorsMilestone.assignTo?.message}
            />
            <MainButton type="submit" isLoading={loadingMilestone}>
              Add milestone
            </MainButton>
          </form>
        </Modal>
      )}
    </>
  );
};

export default ProjectTab;
