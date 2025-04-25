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
        "flex items-center w-fit capitalize font-medium pl-4 pr-7 text-md py-2.5 relative cursor-pointer",
        isFirst && "rounded-l-full",
        isLast && "rounded-r-full",
        isActive ? "bg-primary text-white" : "bg-[#092327]/5 text-[#00000080]"
      )}
    >
      {!isFirst && (
        <div
          className="w-[18px] h-[46px] absolute -top-0.5 -left-3 bg-white flex items-center justify-center text-xl font-bold"
          style={{
            clipPath: "polygon(0% 0%, 57% 0%, 100% 50%, 57% 100%, 0% 100%, 43% 50%)",
          }}
        ></div>
      )}
      {text}
      {!isLast && (
        <div
          className="w-[18px] h-[46px] absolute -top-0.5 -right-[15px] bg-transparent  flex items-center justify-center text-xl font-bold"
          style={{
            clipPath: "polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%, 50% 50%)",
          }}
        ></div>
      )}
    </div>
  );
}

export default Spade;
