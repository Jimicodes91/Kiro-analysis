import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import AddUserModalForm from "./add-user-model-form";
import UsersTable from "./user-table";

const SysAdminUsersPage: React.FC = () => {
  const { onClose, isOpen, onOpen } = useDisclosure();
  const [search, setSearchQuery] = React.useState("");

  const debounceText = useDebounce(search, 1200);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-5">
      <div className="flex justify-between items-center my-2">
        <div className="flex items-center gap-4">
          <Heading size="h3">Users</Heading>
          <div className="relative w-full min-w-[300px] bg-[#F3F3F3] rounded-full">
            <IoSearchOutline className="absolute top-[50%] -translate-y-[50%] left-3 text-[#808080]" />
            <Input
              placeholder="Search by user name"
              className="w-full pl-8 text-[#00000080]"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              type="search"
            />
          </div>
        </div>
        <Button size="sm" leftIcon={<LuPlus className="text-white" />} onClick={onOpen}>
          Add Sysadmin
        </Button>
      </div>
      <UsersTable search={debounceText} />
      {/* Modal to add user */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && <AddUserModalForm isOpen={isOpen} onClose={onClose} />}
      </AnimatePresence>
    </div>
  );
};

export default SysAdminUsersPage;
