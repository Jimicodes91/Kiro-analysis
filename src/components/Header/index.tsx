import useGetCompanyDetails from "@/hooks/admin/use-get-company";
import useGetUser from "@/hooks/user/use-get-user";
import React from "react";
import { FaIndustry } from "react-icons/fa";
import NotificationBell from "../Notifications/NotificationBell";
import Heading from "../ui/heading";
import { UserNav } from "../ui/user-avatar-nav";

const DashBoardHeader: React.FC = () => {
  const userData = useGetUser();
  const company = useGetCompanyDetails(userData?.value?.data?.company_id ?? "");

  return (
    <div className="flex w-full md:flex justify-between md:items-center mb-3 border-b border-brand-border p-3 ">
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
          <NotificationBell />
          <UserNav />

          <div className="z-50  flex items-center ml-3">{/* <MobileSideNav /> */}</div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardHeader;
