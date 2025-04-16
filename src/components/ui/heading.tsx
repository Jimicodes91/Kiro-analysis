import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { DetailedHTMLProps, HTMLAttributes } from "react";

const headerClasses = cva([`font-[700]`], {
  variants: {
    size: {
      h1: ["text-[34px] leading-[52px]"],
      h2: ["text-[24px] sm:text-[30px] leading-[45px]"],
      h3: ["text-[20px] sm:text-[26px] leading-[36px]"],
      h4: ["text-[18px] sm:text-[20px] leading-[30px]"],
      h5: ["text-[14px] sm:text-[18px] leading-[27px]"],
      h6: ["text-[12px] sm:text-[14px] leading-[24px]"],
      h7: ["text-[12px] leading-[20px]"],
    },
  },
  defaultVariants: {
    size: "h2",
  },
});

export interface HeadingProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
    VariantProps<typeof headerClasses> {
  as?: HeaderTypes;
}
type HeaderTypes = "h1" | "h2" | "h3" | "h4";

function Heading({ children, size, as = "h2", style, className = "" }: HeadingProps) {
  const allowedTypes = ["h1", "h2", "h3", "h4", "h5"];
  const Comp = allowedTypes.includes(as) ? as : ("h2" as const);

  const classNames = cn(headerClasses({ size }), className);
  return (
    <Comp className={classNames} style={style}>
      {children}
    </Comp>
  );
}

export default Heading;
