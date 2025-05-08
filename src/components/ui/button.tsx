import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { BeatLoader } from "react-spinners";
import { Icons } from "./icons";

const buttonVariants = cva(
  "inline-flex items-center relative justify-center transition-all text-md transition-all duration-300 rounded-lg gap-2 whitespace-nowrap rounded-full text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-90 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white border-primary focus:ring-primary focus:ring-2 focus:ring-offset-1",
        destructive:
          "border-destructive border bg-transparent text-destructive shadow-sm hover:bg-destructive/80 hover:text-white focus-visible:ring-destructive focus:ring-destructive focus:ring-2 focus:ring-offset-1",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-6",
        sm: "h-10 rounded-full px-6 py-4 text-[0.8rem]",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  slotClassName?: HTMLButtonElement["className"];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      leftIcon,
      rightIcon,
      variant = "default",
      size,
      isLoading = false,
      disabled,
      className = "",
      asChild,
      fullWidth,
      slotClassName = "",
      type = "button",
      ...others
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const spinnerColor: Record<NonNullable<typeof variant>, string> = {
      default: "white",
      destructive: "red",
      ghost: "#092428",
      link: "#092428",
      outline: "#092428",
      secondary: "#092428",
    };
    return (
      <Comp
        ref={ref}
        type={type}
        disabled={isLoading || disabled}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...others}
      >
        {leftIcon && (
          <span
            style={{
              opacity: isLoading ? 0 : 1,
            }}
          >
            {leftIcon}
          </span>
        )}
        <Slottable>
          <span
            style={{
              opacity: isLoading ? 0 : 1,
            }}
            className={cn(
              "inline-flex items-center rounded-full justify-center gap-3 w-full h-full",
              slotClassName
            )}
          >
            {children}
          </span>
        </Slottable>

        {rightIcon && (
          <span
            style={{
              opacity: isLoading ? 0 : 1,
            }}
          >
            {rightIcon}
          </span>
        )}
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {size === "icon" ? (
              <Icons.spinner
                color={spinnerColor[variant!]}
                className="animate-spin h-4 w-4"
              />
            ) : (
              <BeatLoader color={spinnerColor[variant!]} size={10} />
            )}
          </div>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
