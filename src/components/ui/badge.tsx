import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center capitalize rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
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
        active: "border-transparent bg-[#ECFDF3] text-[#027A48]",
        inactive: "border-transparent text-[#FFCC00] bg-[#FAFAE5]",
        deactivated: "border-transparent text-[#FF3B30] bg-[#F7EEE2]",
        warn: "border-transparent bg-brand-slate text-brand-label",
        customer: "border-transparent bg-pri-base text-white py-1",
        base: "border-transparent rounded-md bg-stroke-base text-pri-base py-1",
        rejected: "border-transparent rounded-md bg-stroke-base text-[#FF3B30] py-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
