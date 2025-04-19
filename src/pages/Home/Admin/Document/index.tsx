import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { MainButton } from "../../../../components/Form/button";
import { FormInput } from "../../../../components/Form/input";
import { FormSelect } from "../../../../components/Form/select";
import Modal from "../../../../components/Modal";
import Table from "../../../../components/Table";
import { addDocumentTypeSchema } from "../../../../components/validationSchema/admin";

interface ColumnDefinition<T, K extends keyof T> {
  key: K;
  header: string;
  width?: string;
  render?: (value: T[K], row: T) => React.ReactNode;
}

interface DocumentType {
  typeName: string;
  accessLevel: string;
  expirationPolicy: number;
}

interface Document extends DocumentType {
  id: number;
  action: string;
}

const DocumentTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const document = [
    {
      id: 1,
      typeName: "Contract",
      accessLevel: "View",
      expirationPolicy: 6,
      action: "",
    },
    {
      id: 2,
      typeName: "Report",
      accessLevel: "Edit",
      expirationPolicy: 6,
      action: "",
    },
    {
      id: 3,
      typeName: "Invoice",
      accessLevel: "Download",
      expirationPolicy: 6,
      action: "",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addDocumentTypeSchema),
  });

  const columns: ColumnDefinition<Document, keyof Document>[] = [
    {
      key: "typeName",
      header: "Type name",
      width: "w-1/3",
    },
    {
      key: "accessLevel",
      header: "Access level",
      width: "w-1/3",
    },
    {
      key: "expirationPolicy",
      header: "Expiration policy",
      width: "w-1/3",
      render: (value) => value + " days",
    },
    {
      key: "action",
      header: "",
      render: () => <BsThreeDotsVertical />,
    },
  ];

  const onSubmit = async (data: DocumentType) => {
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
        <h1 className="text-[16px] font-[600]">Document type </h1>
        <MainButton onClick={() => setIsModalOpen(true)}>
          {" "}
          <span className="mr-3 text-xl">
            <IoAdd className="text-white" />
          </span>
          Document type
        </MainButton>
      </div>
      <Table
        data={document}
        columns={columns}
        className="border-none"
        rowClassName="border-b hover:bg-gray-50 transition-colors"
      />
      {/* Modal to add document type */}
      {isModalOpen && (
        <Modal
          title="Add document type"
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
            <FormSelect
              label="Access Level"
              options={[
                { value: "view", label: "View" },
                { value: "edit", label: "Edit" },
                { value: "download", label: "Download" },
              ]}
              register={register("accessLevel")}
              error={errors.accessLevel?.message}
            />
            <FormSelect
              label="Expiration policy (days)"
              options={[
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
              ]}
              register={register("expirationPolicy")}
              error={errors.expirationPolicy?.message}
            />
            <MainButton type="submit" isLoading={loading}>
              Add document type
            </MainButton>
          </form>
        </Modal>
      )}
    </>
  );
};

export default DocumentTab;
