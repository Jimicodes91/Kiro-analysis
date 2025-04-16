import { motion } from "framer-motion";

import { buttonVariants } from "@/components/ui/button";
import { DashboardLinkType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface AccountNavProps {
  isCollapsed: boolean;
  className?: string;
  links: DashboardLinkType[];
  isLoading?: boolean;
}

function AccountNav({ links, isCollapsed, className }: AccountNavProps) {
  const { pathname } = useLocation();
  const isActive = (link: AccountNavProps["links"][0]) =>
    link.exact ? pathname === link.path : pathname?.includes(link.path);

  return (
    <div className="w-full">
      <div
        data-collapsed={isCollapsed}
        className={cn(
          "group flex flex-col py-2 w-full data-[collapsed=true]:py-2 duration-300 ease-in-out"
        )}
      >
        <nav className={cn("grid gap-3 w-full", className)}>
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                }),
                !isActive(link) ? "text-[#425563] hover:bg-secondary/70" : "font-bold",
                "justify-start rounded-none py-3 pl-5 w-full relative text-[0.9rem] min-w-full"
              )}
            >
              <link.icon className="h-10 w-10 text-lg font-bold" />
              {link.title}
              {isActive(link) ? (
                <motion.div
                  className="absolute top-0 right-0 rounded-full h-full w-1 bg-primary"
                  layoutId={`underline-line`}
                  id="underline"
                />
              ) : null}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default AccountNav;
