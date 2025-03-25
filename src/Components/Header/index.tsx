import React from 'react'
import { MdNotificationImportant } from "react-icons/md";
import MobileSideNav from '../DashboardSidebar/MobileSideNav';

const DashBoardHeader: React.FC = () => {
  return (
    <div className="flex w-full md:flex justify-between md:items-center">
    <div className=" flex w-full items-center">
        <div className="md:flex md:flex-[.3] hidden ">
            <h2 className="hidden md:flex md:pl-3 md:text-[25px] text-[#111]">
            Orizon Digital
            </h2>
        </div>

        <div className="flex-[1]   flex justify-end items-center center">

            <button className="mr-5 cursor-pointer relative" type="button" >
                <MdNotificationImportant />
            </button>
            <div className="z-50  flex items-center ml-3">
                <MobileSideNav />
            </div>
        </div>
    </div>

</div>
  )
}

export default DashBoardHeader