import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/DashboardSidebar';


const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="bg-white overflow-x-hidden w-screen h-screen relative">
      <div className="flex p-2">
        <nav 
          className="py-2 z-20 h-[95vh] mt-6 rounded-lg fixed top-0 hidden md:block"
          style={{
            width: isSidebarCollapsed ? '80px' : '13%',
            transition: 'width 0.3s ease-in-out',
          }}
        >
          <div
            className="flex flex-col rounded-lg h-full items-center w-full"
            style={{
              background: "linear-gradient(180deg, #e2f0dbcc, #d0e0c7cc)",
            }}
          >
            <div className="w-full mt-6 h-full">
              <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
              />
            </div>
          </div>
        </nav>
        
        <div className={`w-[98vw] sm:w-[97vw] lg:w-[98vw] md:my-[70px] md:w-[96vw] mb-[70px] ${
          isSidebarCollapsed ? 'md:pl-24' : 'md:pl-48 lg:pl-[21vw]'
        }`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;