import { ClipLoader } from "react-spinners";

type MainButtonProps = {
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  style?: React.CSSProperties;
  variant?: "filled" | "outlined";
};

export const MainButton: React.FC<MainButtonProps> = ({
  isLoading,
  onClick,
  type = "button",
  children,
  className = "",
  disabled = false,
  variant = "filled",
  ...props
}) => {
  const baseStyles =
    "h-[41px] text-[16px] justify-center flex items-center py-6 px-10 rounded-3xl border transition-all duration-200";

  const filledStyles = "bg-primary text-white border-primary";

  const outlinedStyles =
    "bg-transparent text-primary border-primary hover:bg-[#E0EFDE] hover:text-primary hover:border-[#E0EFDE]";

  return (
    <button
      type={type}
      className={`${baseStyles} ${variant === "filled" ? filledStyles : outlinedStyles} ${className}`}
      {...props}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ClipLoader color={variant === "filled" ? "#fff" : "#000"} size="20px" />
      ) : (
        children
      )}
    </button>
  );
};
