import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import {
  // useFieldArray,
  useForm,
} from "react-hook-form";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { MainButton } from "../../../../components/Form/button";
import { FormInput } from "../../../../components/Form/input";
import { FormSelect } from "../../../../components/Form/select";
import Modal from "../../../../components/Modal";
import Table from "../../../../components/Table";
import { addMilestoneSchema } from "../../../../components/validationSchema/admin";

interface ColumnDefinition<T, K extends keyof T> {
  key: K;
  header: string;
  width?: string;
  render?: (value: T[K], row: T) => React.ReactNode;
}

// Interfaces for the form data
// interface ProjectTypeFormData {
//   projectName: string;
//   assignTo: string;
//   milestones: { value: string }[]; // Array of milestones
// }

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
  typeName: string;
  action: string;
}

const ProjectTab: React.FC = () => {
  //   const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  //   const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  //   const [loadingType, setLoadingType] = useState(false);
  const [loadingMilestone, setLoadingMilestone] = useState(false);
  const project = [
    {
      id: 1,
      typeName: "Dubai Registration",
      action: "",
    },
    {
      id: 2,
      typeName: "Dubai Registration",
      action: "",
    },
    {
      id: 3,
      typeName: "Dubai Registration",
      action: "",
    },
  ];

  // Project type form
  //   const {
  //     register: registerType,
  //     handleSubmit: handleSubmitType,
  //     control: typeControl,
  //     formState: { errors: errorsType },
  //   } = useForm<ProjectTypeFormData>({
  //     resolver: yupResolver(addProjectTypeSchema),
  //     defaultValues: {
  //       milestones: [{ value: "" }],
  //     },
  //   });

  // Field array for milestones
  //   const { fields, append } = useFieldArray({
  //     control: typeControl,
  //     name: "milestones",
  //   });

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
      key: "typeName",
      header: "Type Name",
      width: "w-2/3",
    },
    {
      key: "action",
      header: "Action",
      width: "w-1/3",
      render: () => (
        <Button variant="outline" onClick={() => {}}>
          View project form{" "}
        </Button>
      ),
    },
  ];

  //   const onSubmitType = async () => {
  //     setLoadingType(true);
  //     try {
  //       // Your API call or actions here
  //       setIsTypeModalOpen(false);
  //     } catch (error) {
  //       console.error(`Failed to add project type:`, error);
  //     } finally {
  //       setLoadingType(false);
  //     }
  //   };

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
      { milestone: "Onboarding", duration: 2, action: "" },
      { milestone: "Design", duration: 3, action: "" },
      { milestone: "Development", duration: 5, action: "" },
    ];
  };

  // Function to get sub-table columns for each row
  const getSubTableColumns = () => {
    // Return specific columns for the sub-table based on row
    return [
      { key: "milestone", header: "Milestone", width: "w-1/2" },
      { key: "duration", header: "Duration", width: "w-1/2" },
      { key: "action", header: "", render: () => <BsThreeDotsVertical /> },
    ];
  };

  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-[16px] font-[600]">Project type </h1>
        <MainButton
          onClick={
            () => {}
            // setIsTypeModalOpen(true)
          }
        >
          {" "}
          <span className="mr-3 text-xl">
            <IoAdd className="text-white" />
          </span>
          Add project type
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

      {/* Modal to add project type */}
      {/* {isTypeModalOpen && (
        <Modal
          title="Add project type"
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
            <FormSelect
              label="Assign to"
              options={[
                { value: "consultant", label: "Consultant" },
                { value: "client", label: "Client" },
                { value: "customer", label: "Customer" },
              ]}
              register={registerType("assignTo")}
              error={errorsType.assignTo?.message}
            />
            <div className="flex flex-col gap-2"> */}
      {/* <label className="text-sm font-medium text-gray-700">Milestone</label> */}
      {/* {fields.map((field, index) => (
                <FormInput
                  key={field.id}
                  placeholder="Milestone"
                  {...registerType(`milestones.${index}.value`)}
                  error={errorsType?.milestones?.[index]?.value?.message}
                />
              ))} */}

      {/* <button
                type="button"
                onClick={() => append({ value: "" })}
                className="flex items-center text-[14px] font-[600] text-black hover:text-primary my-3"
              >
                <IoAdd className="mr-2 text-[14px] font-[600] text-black hover:text-primary" />
                Add milestone
              </button>
            </div>
            <MainButton modalButton type="submit" isLoading={loadingType}>
              Add project type
            </MainButton>
          </form>
        </Modal>
      )} */}

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
            <MainButton modalButton type="submit" isLoading={loadingMilestone}>
              Add milestone
            </MainButton>
          </form>
        </Modal>
      )}
    </>
  );
};

export default ProjectTab;
