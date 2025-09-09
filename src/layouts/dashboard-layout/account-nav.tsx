import { AnimatePresence, motion } from "framer-motion";

import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DashboardLinkType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
interface AccountNavProps {
  isCollapsed: boolean;
  className?: string;
  links: DashboardLinkType[];
  layoutId?: string;
}

function AccountNav({
  links,
  isCollapsed,
  className,
  layoutId = `account-layout`,
}: AccountNavProps) {
  const { pathname } = useLocation();
  const isActive = (link: AccountNavProps["links"][0]) =>
    link.exact ? pathname === link.path : pathname?.includes(link.path);

  return (
    <div className="w-full">
      <div
        data-collapsed={isCollapsed}
        className={cn("group flex flex-col py-2 w-full duration-300 ease-in-out")}
      >
        <TooltipProvider delayDuration={0}>
          <nav className={cn("grid gap-2 w-full", className)}>
            {links.map((link, index) => (
              <Tooltip key={index} disableHoverableContent={!isCollapsed}>
                <TooltipTrigger asChild>
                  <Link
                    to={link.path}
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                      }),
                      !isActive(link) ? "text-[#425563]" : "font-bold",
                      "justify-start h-[20px] py-5 rounded-none w-full relative text-[0.9rem] min-w-full hover:bg-secondary"
                    )}
                  >
                    {/* @ts-expect-error fix */}
                    <link.icon className="[&_svg]:size-6 size-6 text-lg font-bold" />
                    <AnimatePresence
                      initial={false}
                      mode="wait"
                      onExitComplete={() => null}
                    >
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0.1, scale: 0.2, origin: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {link.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive(link) ? (
                      <motion.div
                        className="absolute top-0 right-0 rounded-none h-full w-[3px] bg-primary"
                        layoutId={layoutId}
                        id="underline"
                      />
                    ) : null}
                  </Link>
                </TooltipTrigger>
                {isCollapsed ? (
                  <TooltipContent
                    sideOffset={4}
                    side="right"
                    className="text-white text-xs py-1 px-3 bg-primary border"
                    arrowPadding={100}
                  >
                    <p>{link.title}</p>
                  </TooltipContent>
                ) : null}
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default AccountNav;
