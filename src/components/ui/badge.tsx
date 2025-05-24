import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center capitalize rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-[#FB002B]/10 text-[#FB002B]",
        outline: "text-foreground",
        success: "border-transparent bg-[#00AA3B1A] text-[#00AA3B]",
        on_track: "border-transparent bg-[#00AA3B1A] text-[#00AA3B]",
        completed: "border-transparent bg-[#00AA3B1A] text-[#00AA3B]",
        active: "border-transparent bg-[#ECFDF3] text-[#027A48]",
        inactive: "border-transparent text-[#FFCC00] bg-[#FAFAE5]",
        late: "border-transparent text-[#FFCC00] bg-[#FAFAE5]",
        due: "border-transparent text-[#FFCC00] bg-[#FAFAE5]",
        deactivated: "border-transparent text-[#FF3B30] bg-[#F7EEE2]",
        not_started: "border-transparent bg-blue-100 text-blue-600",
        pending: "border-transparent bg-blue-100 text-blue-600",
        in_progress: "border-transparent bg-[#F1E6D4] text-[#B78026] py-1",
        blocked: "border-transparent rounded-md bg-stroke-base text-pri-base py-1",
      },
      size: {
        md: "px-4 py-2",
        sm: "px-2 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
