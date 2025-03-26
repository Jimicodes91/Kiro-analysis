import React from "react";
import { SidebarLayoutProps } from "../../types";

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  image,
  title,
  isCollapsed,
}) => (
  <div
    className={`flex items-center my-4 px-1 ${isCollapsed ? "justify-center" : "px-5"}`}
  >
    {image && (
      <div className="flex items-center">
        {typeof image === "string" ? (
          <img
            src={image}
            alt={title}
            className="w-[24px] h-[24px] transition-all"
          />
        ) : (
          <span className="text-dark">{image}</span>
        )}
      </div>
    )}

    {!isCollapsed && (
      <h1 className="pl-2 text-base text-dark whitespace-nowrap">{title}</h1>
    )}
  </div>
);

export default SidebarLayout;
