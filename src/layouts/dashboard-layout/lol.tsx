import { AnimatePresence, motion } from "framer-motion";

import { Logo, LogoWithText } from "@/assets";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { SIDEBAR_COOKIE_NAME } from "@/components/ui/sidebar";
import { UserNav } from "@/components/ui/user-avatar-nav";
import useGetCompanyDetails from "@/hooks/admin/use-get-company";
import useDisclosure from "@/hooks/use-disclosure";
import { topNavData } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getUserSession } from "@/services/api.service";
import { getCookie, setCookie } from "cookies-next";
import { PanelLeft } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import AccountNav from "./account-nav";
import LogoutModal from "./logout-modal";

export default function AccountLayout() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const user = getUserSession();
  const company = useGetCompanyDetails(user?.company_id ?? "");
  const isSiderbarOpen = getCookie(SIDEBAR_COOKIE_NAME);
  const [isCollapsed, setCollapsed] = React.useState(
    isSiderbarOpen ? Boolean(+isSiderbarOpen) : false
  );

  return (
    <div className="h-auto flex">
      <motion.div
        className={cn(
          "space-y-1 z-10 h-screen sticky top-0 hidden flex-shrink-0 left-0 transition-all duration-300 ease-in border-r border-r-gray-200 lg:flex flex-col justify-between bg-secondary/50",
          isCollapsed ? "w-[64px]" : "w-[200px]"
        )}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.1, scale: 0.2 }}
      >
        <div>
          <div
            className={cn(
              "flex h-[100px] items-center transition-all duration-300 ease-in px-4"
            )}
          >
            <Link to="/">
              <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
                {isCollapsed ? (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={Logo}
                    alt=""
                    className="w-9 h-7"
                  />
                ) : (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={LogoWithText}
                    alt=""
                    className="w-20 h-6"
                  />
                )}
              </AnimatePresence>
            </Link>
          </div>

          <AccountNav
            isCollapsed={isCollapsed}
            links={user ? topNavData?.[user?.role] : []}
          />
        </div>
        <div>
          <Separator />
        </div>
      </motion.div>

      <div className="w-full flex-1 relative transition-all duration-300 ease-in">
        <div className="px-6 flex border-b bg-white sticky top-0 z-20 items-center justify-between h-[70px]">
          <div className="flex gap-2 items-center">
            <Button
              onClick={() =>
                setCollapsed((prev) => {
                  setCookie(SIDEBAR_COOKIE_NAME, !prev ? 1 : 0);
                  return !prev;
                })
              }
              size="icon"
              variant="ghost"
            >
              <PanelLeft className="w-5 h-5 text-primary" />
            </Button>
            {company?.isPending ? (
              <div className="h-8 min-w-[200px] bg-slate-300 animate-pulse"></div>
            ) : (
              <Heading size="h3" className="capitalize">
                {company?.value?.data?.name}
              </Heading>
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
