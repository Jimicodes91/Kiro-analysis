import SidebarLayout from "./SidebarLayout";
import { useNavigate } from "react-router-dom";
import { DashboardBottomLinks, DashboardSidebarLinks } from "./data";
import { Logo, LogoWithText, LeftArrow, RightArrow } from "../../assets";
import "../../index.css";
import { useState } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const handleLinkClick = (url: string) => {
    if (url === "logout") {
      localStorage.clear();
      navigate("/");
    } else if (url === "toggle") {
      toggleSidebar();
    } else {
      navigate(url);
    }
  };

  const isLinkActive = (url: string) => {
    // Check if the current path starts with the menu item's URL
    return location.pathname.startsWith(`/${url}`);
  };

  return (
    <div className="relative flex flex-col h-full justify-between">
      {/* Top right arrow */}
      <button
        onClick={() => handleLinkClick("toggle")}
        className="absolute top-8 -right-3 z-30"
      >
        {isCollapsed ? (
          <img src={RightArrow} alt="" className="w-6 h-6" />
        ) : (
          <img src={LeftArrow} alt="" className="w-6 h-6" />
        )}
      </button>

      <div className={`mb-8 ${isCollapsed ? "flex justify-center" : "pl-6"}`}>
        {isCollapsed ? (
          <img src={Logo} alt="" className="w-9 h-7" />
        ) : (
          <img src={LogoWithText} alt="" className="w-20 h-6" />
        )}
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <div className="space-y-4 mb-4">
          {DashboardSidebarLinks.map(({ id, title, image, url }) => (
            <div
              onClick={() => handleLinkClick(url)}
              role="button"
              tabIndex={0}
              onKeyDown={() => handleLinkClick(url)}
              key={id}
              className={`py-[1px] cursor-pointer hover:bg-[#0923271A] transition-all relative hover:text-[#191819]`}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {isLinkActive(url) && (
                <div className="absolute top-0 right-0 h-full w-[4px] rounded bg-primary"></div>
              )}
              {isCollapsed ? (
                <div className="relative group/icon">
                  <SidebarLayout
                    title={title}
                    image={image}
                    isCollapsed={isCollapsed}
                    isActive={isLinkActive(url)}
                    isHovered={hoveredId === id}
                  />
                  {/* Tooltip */}
                  <div
                    className="
                absolute right-2 top-8
                bg-gray-800 text-white text-sm px-2 py-1 
                rounded shadow-lg 
                opacity-0 group-hover/icon:opacity-100 z-50
                "
                  >
                    {title}
                  </div>
                </div>
              ) : (
                <SidebarLayout
                  title={title}
                  image={image}
                  isCollapsed={isCollapsed}
                  isActive={isLinkActive(url)}
                  isHovered={hoveredId === id}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto mb-6">
        {DashboardBottomLinks.map(({ id, title, image, url }) => (
          <div
            onClick={() => handleLinkClick(url)}
            role="button"
            tabIndex={0}
            onKeyDown={() => handleLinkClick(url)}
            key={id}
            className={`py-[1px] cursor-pointer hover:bg-[#0923271A] transition-all relative hover:text-[#191819]`}
          >
            {isCollapsed ? (
              <div className="relative group/icon">
                <SidebarLayout
                  title={title}
                  image={image}
                  isCollapsed={isCollapsed}
                  isActive={isLinkActive(url)}
                  isHovered={hoveredId === id}
                />
                {/* Tooltip */}
                <div
                  className="
                    absolute right-2 top-6
                    bg-gray-800 text-white text-sm px-2 py-1 
                    rounded shadow-lg 
                    opacity-0 group-hover/icon:opacity-100 z-50
                  "
                >
                  {title}
                </div>
              </div>
            ) : (
              <SidebarLayout
                title={title}
                image={image}
                isCollapsed={isCollapsed}
                isActive={isLinkActive(url)}
                isHovered={hoveredId === id}
              />
            )}
          </div>
        ))}

        {/* <div
          onClick={() => handleLinkClick('toggle')}
          role="button"
          tabIndex={0}
          onKeyDown={() => handleLinkClick('toggle')}
          className="py-[1px] cursor-pointer hover:bg-white/10 transition-all"
        >
          <SidebarLayout
            title={isCollapsed ? 'Expand' : 'Collapse'}
            image={isCollapsed ? <FaArrowRightLong /> : <FaArrowLeftLong />}
            isCollapsed={isCollapsed}
          />
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
