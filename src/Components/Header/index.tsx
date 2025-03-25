import React from 'react'
import MobileSideNav from '../DashboardSidebar/MobileSideNav';
import { Avatar, Orizonal } from '../../assets';
import { VscBell } from 'react-icons/vsc';

const DashBoardHeader: React.FC = () => {
  return (
    <div className="flex w-full md:flex justify-between md:items-center mb-3 border-b border-[#0000001A] p-3 ">
    <div className=" flex w-full items-center">
        <div className="md:flex md:flex-[.5] ">
            <img src={Orizonal} alt="" className='w-10 h-10' />
            <h2 className=" md:flex md:pl-3 md:text-[24px] text-[#191819] font-bold">
            Orizon Digital
            </h2>
        </div>

        <div className="flex-[1]   flex justify-end items-center center">

            <button className="mr-5 cursor-pointer relative border-2 border-[#0000001A] p-2 rounded-full
            " type="button" >
            <VscBell  className='text-[#111] w-6 h-6' />
            <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 flex justify-center items-center text-xs">3</span>
            </button>
            <div className=' border-0 border-l border-[#e5e5e5] p-2'>
            <img src={Avatar} alt="" />
            </div>
           
            <div className="z-50  flex items-center ml-3">
                <MobileSideNav />
            </div>
        </div>
    </div>

</div>
  )
}

export default DashBoardHeader