import React, { useState } from "react";
import Table from "../../../../components/Table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MainButton } from "../../../../components/Form/button";
import { IoAdd } from "react-icons/io5";
import Modal from "../../../../components/Modal";
import { FormInput } from "../../../../components/Form/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addTaskTypeSchema } from "../../../../components/validationSchema/admin";

interface ColumnDefinition<T, K extends keyof T> {
  key: K;
  header: string;
  width?: string;
  render?: (value: T[K], row: T) => React.ReactNode;
}

interface TaskType {
  typeName: string;
  description: string;
}

interface Task extends TaskType {
  id: number;
  action: string;
}

const TaskTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const task = [
    {
      id: 1,
      typeName: "Conference",
      description: "Verification of passport validity",
      action: "",
    },
    {
      id: 2,
      typeName: "Mixer",
      description: "Verification of passport validity",
      action: "",
    },
    {
      id: 3,
      typeName: "Product launch",
      description: "Verification of passport validity",
      action: "",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addTaskTypeSchema),
  });

  const columns: ColumnDefinition<Task, keyof Task>[] = [
    {
      key: "typeName",
      header: "Type name",
      width: "w-1/3",
    },
    {
      key: "description",
      header: "Description",
      width: "w-2/3",
    },
    {
      key: "action",
      header: "",
      render: () => <BsThreeDotsVertical />,
    },
  ];

  const onSubmit = async (data: TaskType) => {
    setLoading(true);
    try {
      //   await sendConsultantInviteApi(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error(`${data}`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-[16px] font-[600]">Task type </h1>
        <MainButton onClick={() => setIsModalOpen(true)}>
          {" "}
          <span className="mr-3 text-xl">
            <IoAdd className="text-white" />
          </span>
          Add task type
        </MainButton>
      </div>
      <div className="border-[1px] p-1 rounded-lg">
        <div className="bg-white   rounded-lg shadow">
          <Table
            data={task}
            columns={columns}
            className="border-none"
            rowClassName="border-b hover:bg-gray-50 transition-colors"
          />
        </div>
      </div>
      {/* Modal to add document type */}
      {isModalOpen && (
        <Modal
          title="Add task type"
          closeModal={() => setIsModalOpen(false)}
          fullHeight={false}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
            <FormInput
              label="Type name"
              placeholder="Type name"
              {...register("typeName")}
              error={errors.typeName?.message}
            />
            <FormInput
              label="Description"
              placeholder="Description"
              type="textarea"
              rows={4}
              {...register("description")}
              error={errors.description?.message}
            />

            <MainButton type="submit" isLoading={loading}>
              Add task type
            </MainButton>
          </form>
        </Modal>
      )}
    </>
  );
};

export default TaskTab;
