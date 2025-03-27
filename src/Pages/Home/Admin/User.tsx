import React, { useState } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import Table from "../../../Components/Table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MainButton } from "../../../Components/Form/button";
import { IoAdd } from "react-icons/io5";

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
        <button
          onClick={() => handleToggle(row.id)}
          className="text-3xl focus:outline-none"
          aria-label={value ? "Deactivate user" : "Activate user"}
        >
          {value ? (
            <FaToggleOn className="text-[#092327]" />
          ) : (
            <FaToggleOff className="text-[#09232733] " />
          )}
        </button>
      ),
    },
    {
      key: "action",
      header: "",
      render: (_value) => <BsThreeDotsVertical />,
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-xl font-bold">Manage user </h1>
        <MainButton>
          {" "}
          <span className="mr-3 text-xl">
            <IoAdd />
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
    </>
  );
};

export default UserTab;
