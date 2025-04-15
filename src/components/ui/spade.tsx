import { cn } from "@/lib/utils";

interface SpadeProps {
  text: string;
  isLast?: boolean;
  isFirst?: boolean;
  isActive: boolean;
}

function Spade({ text, isLast, isFirst, isActive }: SpadeProps) {
  return (
    <div
      className={cn(
        "flex items-center w-full capitalize px-10 text-md py-3 relative cursor-pointer",
        isFirst && "rounded-l-full",
        isLast && "rounded-r-full",
        isActive ? "bg-primary text-white" : "bg-[#092327]/10 text-primary"
      )}
    >
      {!isFirst && (
        <div
          className="w-[18px] h-12 absolute -top-0.5 -left-3 bg-white flex items-center justify-center text-xl font-bold"
          style={{
            clipPath: "polygon(0% 0%, 57% 0%, 100% 50%, 57% 100%, 0% 100%, 43% 50%)",
          }}
        ></div>
      )}
      {text}
      {!isLast && (
        <div
          className="w-[18px] h-12 absolute -top-0.5 -right-[15px] bg-white  flex items-center justify-center text-xl font-bold"
          style={{
            clipPath: "polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%, 50% 50%)",
          }}
        ></div>
      )}
    </div>
  );
}

export default Spade;
