import React from "react";
import { SidebarLayoutProps } from "../../types";

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  image,
  title,
  isCollapsed,
  isActive = false,
  isHovered
}) => (
  <div
    className={`flex items-center my-2 px-1 ${isCollapsed ? "justify-center" : "px-5"}`}
  >
    {image && (
      <div className="flex items-center">
        {typeof image === "string" ? (
          <img
            src={image}
            alt={title}
            className={`w-[24px] h-[24px] transition-all ${isHovered ? "opacity-100" : ""}  ${isActive ? 'opacity-100' : 'opacity-60'}`}
            
          />
        ) : (
          <span className={`
            ${isActive ? 'text-[#191819]' : 'text-gray-500'} ${isHovered ? "opacity-100" : ""} 
          `}>{image}</span>
        )}
      </div>
    )}

    {!isCollapsed && (
      <h1 className={`pl-2 text-base whitespace-nowrap text-[#191819] font-semibold text-["16px"] ${isHovered ? "opacity-100" : ""}    ${isActive ? ' opacity-100' : ' opacity-60 group-hover:text-[[#191819]] hover:opacity-100'}`}>{title}</h1>
    )}
  </div>
);

export default SidebarLayout;
