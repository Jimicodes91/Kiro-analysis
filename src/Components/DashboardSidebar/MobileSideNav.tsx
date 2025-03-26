import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCurrentPath from "../../Hooks/useCurrentPath";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { SidebarLinks } from "../../types";
import { DashboardSidebarLinks, DashboardBottomLinks } from "./data";
import SidebarLayout from "./SidebarLayout";
import { Logo } from "../../assets";

const MobileSideNav: React.FC = () => {
  const navigate = useNavigate();
  const activeLink = useCurrentPath();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleNavigation = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };

  const renderLinks = (links: SidebarLinks[]) => {
    return links.map(({ id, title, image, url }) => (
      <div
        key={id}
        onClick={() => handleNavigation(url)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleNavigation(url)}
        aria-label={`Navigate to ${title}`}
        className="py-[1px] cursor-pointer hover:bg-primary/20 transition-colors duration-200"
        style={{
          background:
            url === activeLink[1]
              ? "linear-gradient(180deg, #092228 0%, #1A4A52 100%);"
              : "",
        }}
      >
        <SidebarLayout title={title} image={image} />
      </div>
    ));
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className="p-3 lg:hidden"
        aria-label="Toggle sidebar"
        aria-expanded={isOpen}
      >
        <RxHamburgerMenu className="text-2xl text-primary" />
      </button>

      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 ${
          isOpen ? "block" : "hidden"
        } lg:hidden`}
      >
        <div className="bg-[#deead7] h-full flex flex-col justify-between">
          <div className="m-5 flex justify-between items-center">
            <div className="my-3 flex justify-center">
              <img src={Logo} alt="" className="w-9 h-7" />
            </div>
            <button
              onClick={toggleSidebar}
              aria-label="Close sidebar"
              className="text-primary"
            >
              <IoMdClose className="text-3xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {renderLinks(DashboardSidebarLinks)}
          </div>

          <div className="mt-auto">{renderLinks(DashboardBottomLinks)}</div>
        </div>
      </div>
    </div>
  );
};

export default MobileSideNav;
