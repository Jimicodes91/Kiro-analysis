import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PiSpinner } from "react-icons/pi";

interface SpadeProps {
  text: string;
  isLast?: boolean;
  isFirst?: boolean;
  isActive: boolean;
  onClick?: () => void;
  isLoading?: boolean;
}

function Spade({ text, isLast, isFirst, isActive, onClick, isLoading }: SpadeProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClick}
            className={cn(
              "relative flex items-center justify-center flex-1 min-w-0 capitalize text-center font-medium text-xs py-2.5 cursor-pointer transition-colors select-none",
              isFirst ? "rounded-l-full pl-4 pr-5" : "pl-5 pr-5",
              isLast ? "rounded-r-full pr-4" : "",
              isActive ? "bg-primary text-white" : "bg-[#E8EAEB] text-[#00000066]"
            )}
          >
            {/* Left arrow notch (white separator) */}
            {!isFirst && (
              <svg
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[1px] z-10"
                width="12"
                height="36"
                viewBox="0 0 12 36"
                fill="none"
              >
                <path d="M0 0L12 18L0 36" fill="white" />
              </svg>
            )}

            <span className="truncate">
              {isLoading ? <PiSpinner className="animate-spin mx-auto" size={16} /> : text}
            </span>

            {/* Right arrow pointer */}
            {!isLast && (
              <svg
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[11px] z-10"
                width="12"
                height="36"
                viewBox="0 0 12 36"
                fill="none"
              >
                <path
                  d="M0 0L12 18L0 36"
                  fill={isActive ? "hsl(var(--primary))" : "#E8EAEB"}
                />
              </svg>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          sideOffset={10}
          className="text-primary text-xs p-2 bg-white border"
          arrowPadding={100}
        >
          <p>
            Progress to <span className="font-bold">{text}</span> phase
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default Spade;
