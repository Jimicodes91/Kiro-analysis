import { AnimatePresence, motion } from "framer-motion";

import { Logo, LogoWithText } from "@/assets";
import { useIsMobile } from "@/hooks/use-mobile";
import { topNavData } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getUserSession } from "@/services/api.service";
import { Link } from "react-router-dom";
import AccountNav from "./account-nav";

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const user = getUserSession();
  const isMobile = useIsMobile();

  const parentStyle = isMobile
    ? ""
    : "space-y-1 z-10 h-screen bg-black sticky top-0  flex-shrink-0 left-0 transition-all duration-300 ease-in border-r border-r-gray-200  flex-col justify-between bg-secondary/50";
  return (
    <motion.div
      className={cn(
        parentStyle,
        isCollapsed
          ? "w-[64px] hidden lg:flex"
          : isMobile
            ? "w-full"
            : "w-[200px] hidden lg:flex"
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
          <Link to="/projects">
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
    </motion.div>
  );
}
