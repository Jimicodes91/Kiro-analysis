import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SIDEBAR_COOKIE_NAME } from "@/components/ui/sidebar";
import { UserNav } from "@/components/ui/user-avatar-nav";
import useDisclosure from "@/hooks/use-disclosure";
import { useIsMobile } from "@/hooks/use-mobile";
import OrgProjectContextProvider from "@/pages/Home/Project/context/org-project-context";
import { getCookie, setCookie } from "cookies-next";
import { PanelLeft } from "lucide-react";
import React from "react";
import LogoutModal from "./logout-modal";
import OrgToggle from "./org-toggle";
import Sidebar from "./sidebar";

export default function AccountLayout({ children }: { children?: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const isSiderbarOpen = getCookie(SIDEBAR_COOKIE_NAME);
  const [isCollapsed, setCollapsed] = React.useState(
    isSiderbarOpen ? Boolean(+isSiderbarOpen) : false
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile
      ? setOpenMobile((open) => !open)
      : setCollapsed((prev) => {
          setCookie(SIDEBAR_COOKIE_NAME, !prev ? 1 : 0);
          return !prev;
        });
  }, [isMobile, setOpenMobile]);

  return (
    <OrgProjectContextProvider>
      <div className="h-auto flex">
        {!isMobile && <Sidebar isCollapsed={isCollapsed} />}

        <div className="w-full flex-1 relative transition-all duration-300 ease-in">
          <div className="px-6 flex border-b bg-white sticky top-0 z-20 items-center justify-between h-[70px]">
            <div className="flex gap-2 items-center">
              <Button onClick={toggleSidebar} size="icon" variant="ghost">
                <PanelLeft className="w-5 h-5 text-primary" />
              </Button>
              <OrgToggle />
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
          <div className="min-h-[calc(100vh-70px)] flex-1">{children}</div>
        </div>
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent side="left-small">
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <Sidebar isCollapsed={false} />
          </SheetContent>
        </Sheet>
        <LogoutModal isOpen={isOpen} onClose={onClose} />
      </div>
    </OrgProjectContextProvider>
  );
}
