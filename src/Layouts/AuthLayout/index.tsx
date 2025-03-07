import { useEffect, useReducer } from "react";
import { Outlet } from "react-router-dom";
import { Group } from "../../assets";

const AuthLayout = () => {
  const initialState = {
    openMobileSideBar: false,
  };
  const [, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    initialState
  );

  useEffect(() => {
    // Cleanup method
    return () => {
      setState({
        ...initialState,
      });
    };
  }, []);

  return (
    <div className="fixed grid w-screen h-screen p-5 rounded-lg md:grid-cols-2">
      {/* Left Side (Background Image and Text) */}
      <div
        className="relative hidden rounded-tl-lg rounded-bl-lg md:flex md:flex-col  md:items-center"
        style={{
          background: `rgba(9, 35, 39, 1)`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {/* Text Content */}
        <div className="relative inset-0 max-w-xl top-40 text-white px-8 py-3 place-self-center">
          <h1 className="text-5xl font-bold leading-[55px] ">
            The All-in-One Relocation & Business Setup Platform
          </h1>
          <p className="text-base leading-[30px] pr-8 mt-6">
            Manage projects, CRM, documents, and <br /> compliance in one
            integrated solution.
          </p>
        </div>

        {/* Image at Bottom Right */}
        <div className="absolute bottom-0 right-0">
          <img src={Group} alt="Group Illustration" className="w-full max-w-[407px]" />
        </div>
      </div>

      {/* Right Side (Form Content) */}
      <div className="flex flex-col p-9 justify-center place-self-center overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;