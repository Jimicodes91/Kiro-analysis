import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { UserNav } from "@/components/ui/user-avatar-nav";
import useDisclosure from "@/hooks/use-disclosure";
import { useIsMobile } from "@/hooks/use-mobile";
import OrgProjectContextProvider from "@/pages/Home/Project/context/org-project-context";
import { PanelLeft } from "lucide-react";
import React from "react";
import LogoutModal from "./logout-modal";
import OrgToggle from "./org-toggle";
import Sidebar from "./sidebar";

export default function AccountLayout({ children }: { children?: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <OrgProjectContextProvider>
      <div className="h-auto flex overflow-x-hidden">
        {!isMobile && <Sidebar isCollapsed={true} />}

        <div className="w-full flex-1 relative transition-all duration-300 ease-in overflow-x-hidden">
          <div className="px-3 sm:px-4 md:px-6 flex border-b bg-white sticky top-0 z-20 items-center justify-between h-[56px] md:h-[70px]">
            <div className="flex gap-2 items-center">
              {isMobile && (
                <button
                  onClick={() => setOpenMobile(true)}
                  className="p-1.5 rounded-md hover:bg-gray-100"
                  aria-label="Open sidebar"
                >
                  <PanelLeft className="w-5 h-5 text-primary" />
                </button>
              )}
              <OrgToggle />
            </div>
            <div className="flex gap-3 ring-pri-60 items-center">
              <UserNav onOpen={onOpen} />
            </div>
          </div>
          <Separator className="sticky z-20 h-0 top-[56px] md:top-[70px]" />
          <div className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-70px)] flex-1">{children}</div>
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
