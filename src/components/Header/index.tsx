import useGetCompanyDetails from "@/hooks/admin/use-get-company";
import { getUserSession } from "@/services/api.service";
import React from "react";
import { FaIndustry } from "react-icons/fa";
import { VscBell } from "react-icons/vsc";
import Heading from "../ui/heading";
import { UserNav } from "../ui/user-avatar-nav";

const DashBoardHeader: React.FC = () => {
  const user = getUserSession();
  const company = useGetCompanyDetails(user?.company_id ?? "");
  console.log(company?.value, "company?.value");

  return (
    <div className="flex w-full md:flex justify-between md:items-center mb-3 border-b border-[#0000001A] p-3 ">
      <div className=" flex w-full items-center">
        <div className="flex gap-2 items-center">
          <div className="grid place-items-center h-11 w-11 rounded-full bg-gray-100">
            <FaIndustry className="w-5 h-5 text-primary" />
          </div>
          {company?.isPending ? (
            <div className="h-8 min-w-[200px] bg-slate-300 animate-pulse"></div>
          ) : (
            <Heading size="h2">{company?.value?.data?.name}</Heading>
          )}
        </div>

        <div className="flex-[1]   flex justify-end items-center center">
          <button
            className="mr-5 cursor-pointer relative border-2 border-[#0000001A] p-2 rounded-full
            "
            type="button"
          >
            <VscBell className="text-[#111] w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 flex justify-center items-center text-xs">
              3
            </span>
          </button>
          <UserNav />

          <div className="z-50  flex items-center ml-3">{/* <MobileSideNav /> */}</div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardHeader;
