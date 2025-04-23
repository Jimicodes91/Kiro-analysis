"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { SIDEBAR_COOKIE_NAME, SidebarProvider } from "@/components/ui/sidebar";
import { UserNav } from "@/components/ui/user-avatar-nav";
import useGetCompanyDetails from "@/hooks/admin/use-get-company";
import useDisclosure from "@/hooks/use-disclosure";
import { getUserSession } from "@/services/api.service";
import { getCookie } from "cookies-next";
import { FaIndustry } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import LogoutModal from "./logout-modal";

export default function AccountLayout() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const user = getUserSession();
  const company = useGetCompanyDetails(user?.company_id ?? "");
  const isSiderbarOpen = getCookie(SIDEBAR_COOKIE_NAME);

  return (
    <div className="h-auto flex">
      <SidebarProvider defaultOpen={isSiderbarOpen ? Boolean(+isSiderbarOpen) : false}>
        <AppSidebar className="bg-slate-300" />
      </SidebarProvider>

      <div className="w-full flex-1 relative transition-all duration-300 ease-in">
        <div className="px-6 flex border-b bg-white sticky top-0 z-20 items-center justify-between h-[70px]">
          <div className="flex gap-2 items-center">
            <div className="grid place-items-center h-11 w-11 rounded-full bg-gray-100">
              <FaIndustry className="w-5 h-5 text-primary" />
            </div>
            {company?.isPending ? (
              <div className="h-8 min-w-[200px] bg-slate-300 animate-pulse"></div>
            ) : (
              <Heading size="h3">{company?.value?.data?.name}</Heading>
            )}
          </div>
          <div className="flex gap-3 ring-pri-60 items-center">
            {/* <Button size="icon" variant="outline" type="button">
              <VscBell className="text-[#111] w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 flex justify-center items-center text-xs">
                3
              </span>
            </Button> */}
            <UserNav onOpen={onOpen} />
          </div>
        </div>
        <Separator className="sticky z-20 h-0 top-[70px]" />
        <div className="min-h-[calc(100vh-70px)] flex-1">
          <Outlet />
        </div>
      </div>
      <LogoutModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
