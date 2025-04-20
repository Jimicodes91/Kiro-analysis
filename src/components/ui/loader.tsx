import { Logo } from "@/assets";

function Loader() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-fit relative">
        <div className="loader w-[130px]"></div>
        <div className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2">
          <img src={Logo} alt="" className="w-12 h-9" />
        </div>
      </div>
    </div>
  );
}

export default Loader;
