import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { MainButton } from "../../../../components/Form/button";
import { FormInput } from "../../../../components/Form/input";
import Modal from "../../../../components/Modal";
import Table from "../../../../components/Table";
import { addEventTypeSchema } from "../../../../utils/validation-schema/admin";

interface ColumnDefinition<T, K extends keyof T> {
  key: K;
  header: string;
  width?: string;
  render?: (value: T[K], row: T) => React.ReactNode;
}

interface EventType {
  typeName: string;
  description: string;
}

interface Event extends EventType {
  id: number;
  action: string;
}

const EventTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const event = [
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
    resolver: yupResolver(addEventTypeSchema),
  });

  const columns: ColumnDefinition<Event, keyof Event>[] = [
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

  const onSubmit = async (data: EventType) => {
    setLoading(true);
    try {
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
        <h1 className="text-[16px] font-[600]">Event type </h1>
        <MainButton onClick={() => setIsModalOpen(true)}>
          {" "}
          <span className="mr-3 text-xl">
            <IoAdd className="text-white" />
          </span>
          Add event type
        </MainButton>
      </div>
      <Table
        data={event}
        columns={columns}
        className="border-none"
        rowClassName="border-b hover:bg-gray-50 transition-colors"
      />
      {/* Modal to add document type */}
      {isModalOpen && (
        <Modal
          title="Add event type"
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
              Add event type
            </MainButton>
          </form>
        </Modal>
      )}
    </>
  );
};

export default EventTab;
