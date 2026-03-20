import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { LuPlus } from "react-icons/lu";
import AddUserModalForm from "./add-user-model-form";
import UsersTable from "./subscription-table";

const SysAdminSubscriptionPage: React.FC = () => {
  const { onClose, isOpen, onOpen } = useDisclosure();

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex justify-between items-center my-2">
        <div className="flex items-center gap-4">
          <Heading size="h3">Subscription</Heading>
        </div>
        <Button size="sm" leftIcon={<LuPlus className="text-white" />} onClick={onOpen}>
          Add plan
        </Button>
      </div>
      <UsersTable />
      {/* Modal to add user */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && <AddUserModalForm isOpen={isOpen} onClose={onClose} />}
      </AnimatePresence>
    </div>
  );
};

export default SysAdminSubscriptionPage;
