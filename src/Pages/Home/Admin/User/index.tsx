import React, { useState } from "react";
import Table from "../../../../Components/Table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MainButton } from "../../../../Components/Form/button";
import { IoAdd } from "react-icons/io5";
import Switch from "../../../../Components/Form/switch";
import Modal from "../../../../Components/Modal";
import { FormInput } from "../../../../Components/Form/input";
import { FormSelect } from "../../../../Components/Form/select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUserSchema } from "../../../../Components/validationSchema/admin";
import { TeamMember } from "../../../../types";
import { sendConsultantInviteApi } from "../../../../Services";

interface ColumnDefinition<T, K extends keyof T> {
  key: K;
  header: string;
  width?: string;
  render?: (value: T[K], row: T) => React.ReactNode;
}

interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
  role?: string;
  department?: string;
  toggle: boolean;
  action?: string;
}

const UserTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "Jessicaparker@gmail.com",
      status: "active",
      role: "Admin",
      department: "Engineering",
      toggle: true,
      action: "",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "Jessicaparker@mail.com",
      status: "inactive",
      role: "Admin",
      department: "Engineering",
      toggle: false,
      action: "",
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addUserSchema),
  });

  const handleToggle = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, toggle: !user.toggle } : user
      )
    );
    console.log(`Toggled user ${userId}`);
  };

  const columns: ColumnDefinition<User, keyof User>[] = [
    {
      key: "name",
      header: "Name",
      width: "w-1/4",
    },
    {
      key: "email",
      header: "Email",
      width: "w-1/4",
    },
    {
      key: "role",
      header: "Role",
      width: "w-1/4",
    },
    {
      key: "department",
      header: "Department",
      width: "w-1/4",
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            (value as User["status"]) === "active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {value as User["status"]}
        </span>
      ),
    },
    {
      key: "toggle",
      header: "Action",
      render: (value, row: User) => (
        <Switch isOn={!!value} onChange={() => handleToggle(row.id)} />
      ),
    },
    {
      key: "action",
      header: "",
      render: (_value) => <BsThreeDotsVertical />,
    },
  ];

  const onSubmit = async (data: TeamMember) => {
    setLoading(true);
     try {
                await sendConsultantInviteApi(data);
    setIsModalOpen(false);

              } catch (error) {
                console.error(`Failed to invite ${data.email}:`, error);
              } finally {
                setLoading(false);
              } 
  };

  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-xl font-bold">Manage user </h1>
        <MainButton onClick={() => setIsModalOpen(true)}>
          {" "}
          <span className="mr-3 text-xl">
            <IoAdd className="text-white" />
          </span>
          Add user
        </MainButton>
      </div>
      <div className="border-[1px] p-1 rounded-lg">
        <div className="bg-white   rounded-lg shadow">
          <Table
            data={users}
            columns={columns}
            className="border-none"
            rowClassName="border-b hover:bg-gray-50 transition-colors"
          />
        </div>
      </div>
      {/* Modal to add user */}
      {isModalOpen && (
        <Modal
          title="Add User"
          closeModal={() => setIsModalOpen(false)}
          fullHeight={false}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
            <FormInput
              label="Email"
              placeholder="Email"
              {...register("email")}
              error={errors.email?.message}
            />
            <FormSelect
              label="Role"
              options={[
                { value: "consultant", label: "Consultant" },
                { value: "client", label: "Client" },
                { value: "customer", label: "Customer" },
              ]}
              register={register("role")}
              error={errors.role?.message}
            />
            <MainButton type="submit" isLoading={loading}>Add User</MainButton>
          </form>
        </Modal>
      )}
    </>
  );
};

export default UserTab;
