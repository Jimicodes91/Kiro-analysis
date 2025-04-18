"use client";

import { Logo, LogoWithText } from "@/assets";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "@/components/ui/user-avatar-nav";
import useGetCompanyDetails from "@/hooks/admin/use-get-company";
import useDisclosure from "@/hooks/use-disclosure";
import { topNavData } from "@/lib/constants";
import getInitials, { cn } from "@/lib/utils";
import { getUserSession } from "@/services/api.service";
import { FaIndustry } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import AccountNav from "./account-nav";
import LogoutModal from "./logout-modal";

export default function AccountLayout() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const user = getUserSession();
  const company = useGetCompanyDetails(user?.company_id ?? "");
  const isCollapsed = false;
  return (
    <div className="h-auto flex">
      <div
        className={cn(
          "space-y-1 z-10 h-screen sticky top-0 flex-shrink-0 left-0 transition-all duration-300 ease-in border-r border-r-gray-200 flex flex-col justify-between w-[210px] bg-secondary/50"
        )}
      >
        <div>
          <div
            className={cn(
              "flex h-[100px] items-center transition-all duration-300 ease-in px-4"
            )}
          >
            <Link to="/">
              {isCollapsed ? (
                <img src={Logo} alt="" className="w-9 h-7" />
              ) : (
                <img src={LogoWithText} alt="" className="w-20 h-6" />
              )}
            </Link>
          </div>

          <AccountNav
            isLoading={false}
            isCollapsed={true}
            links={user ? topNavData?.[user?.role] : []}
          />
        </div>
        <div>
          <Separator />
          <Button
            variant="ghost"
            className="relative h-auto py-4 w-full px-1 flex gap-1 rounded-none"
            rightIcon={<Icons.logout />}
            onClick={onOpen}
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={""} alt="@shadcn" />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <span className="flex flex-col items-start">
              <span className="font-bold text-bl-base">{user?.name || "User"}</span>
              <span className="text-pri-50 text-xs max-w-[120px] whitespace-nowrap text-ellipsis overflow-hidden">
                {user?.email}
              </span>
            </span>
          </Button>
        </div>
      </div>

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
