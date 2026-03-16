import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import useGetAllFinanceRecords from "@/hooks/finance/use-get-all-finance-records";
import { getUserSession } from "@/services/api.service";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { IoAdd, IoSearchOutline } from "react-icons/io5";
import FinanceEmptyState from "./finance-empty-state";
import FinanceModal from "./finance-modal-form";
import FinanceTable from "./finance-table";

const Finance: React.FC = () => {
  const [, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddBilling = () => {
    setIsModalOpen(true);
  };

  const session = getUserSession();
  const billingsResponse = useGetAllFinanceRecords(session?.company_id ?? "", 1, 10);
  const billings = Array.isArray(billingsResponse?.data?.data?.data)
    ? billingsResponse.data.data.data
    : [];

  return (
    <>
      <div className="mx-3 sm:mx-4 md:mx-6 my-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 my-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Heading size="h3" className="whitespace-nowrap">
              Finance and billing
            </Heading>
            <div className="relative flex-1 sm:flex-initial sm:min-w-[200px] md:min-w-[300px] bg-[#F3F3F3] rounded-full">
              <IoSearchOutline className="absolute top-[50%] -translate-y-[50%] left-3 text-[#808080]" />
              <Input
                placeholder="Search keyword"
                className="w-full pl-8 text-[#00000080]"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex justify-between space-x-2">
            <Button
              size="sm"
              leftIcon={<IoAdd className="text-white w-6 h-6" />}
              onClick={handleAddBilling}
            >
              Add billing
            </Button>
          </div>
        </div>
        {Array.isArray(billingsResponse?.data?.data?.data) && billings.length === 0 ? (
          <FinanceEmptyState />
        ) : (
          <FinanceTable />
        )}
      </div>

      {/* Finance Modal for creating new billing entries */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isModalOpen && (
          <FinanceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            mode="create"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Finance;
