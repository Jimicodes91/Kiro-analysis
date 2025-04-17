import { Button } from "@/components/ui/button";
import useGetAllAdmins from "@/hooks/admin/use-get-all-admins";
import useDisclosure from "@/hooks/use-disclosure";
import React from "react";
import { LuPlus } from "react-icons/lu";
import AddUserModalForm from "./add-user-model-form";
import UsersTable from "./user.table";

const UserTab: React.FC = () => {
  const { onClose, isOpen, onOpen } = useDisclosure();
  useGetAllAdmins();
  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-[16px] font-[600]">Manage user </h1>
        <Button leftIcon={<LuPlus className="text-white" />} onClick={onOpen}>
          Add user
        </Button>
      </div>
      <UsersTable />
      {/* Modal to add user */}
      {isOpen && <AddUserModalForm isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default UserTab;
