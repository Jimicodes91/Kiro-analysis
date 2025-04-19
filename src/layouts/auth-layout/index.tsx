import { Outlet } from "react-router-dom";
import { Group } from "../../assets";

const AuthLayout = () => {
  return (
    <div className="fixed flex justify-center items-center md:justify-normal md:items-stretch  w-screen h-screen p-5 rounded-lg md:grid md:grid-cols-[40%_60%]">
      {/* Left Side (Background Image and Text) */}
      <div
        className="relative hidden rounded-lg md:flex md:flex-col bg-center bg-cover bg-no-repeat"
        style={{
          background: `rgba(9, 35, 39, 1)`,
        }}
      >
        {/* Text Content */}
        <div className="relative inset-0 max-w-xl top-20 text-white pr-8 pl-12 py-3 ">
          <h1 className="text-[42px] font-bold leading-[normal]">
            The All-in-One <br /> Relocation & <br /> Business Setup <br /> Platform
          </h1>
          <p className="text-[18px] font-[300] leading-[normal] pr-8 mt-6">
            Manage projects, CRM, documents, and <br /> compliance in one integrated
            solution.
          </p>
        </div>

        {/* Image at Bottom Right */}
        <div className="absolute bottom-0 right-0">
          <img src={Group} alt="Group Illustration" className="w-full max-w-[390px]" />
        </div>
      </div>

      {/* Right Side (Form Content) */}
      <div className="flex flex-col w-full max-w-lg p-5 md:p-9 justify-center self-center place-self-center overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
