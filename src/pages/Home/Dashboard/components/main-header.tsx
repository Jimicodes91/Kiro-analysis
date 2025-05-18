import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { GoShare } from "react-icons/go";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";

export const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center my-4">
      <Heading size="h3">Home</Heading>
      <div className="flex justify-between space-x-2">
        <Button
          size="sm"
          variant="outline"
          leftIcon={<HiOutlineAdjustmentsVertical className="text-[#111] w-6 h-6" />}
          className="border-black"
        >
          Filter
        </Button>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<GoShare className="text-[#111] w-6 h-6" />}
          className="border-black"
        >
          Export
        </Button>
      </div>
    </div>
  );
};
