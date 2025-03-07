import { ClipLoader } from "react-spinners"

type MainButtonProps = {
  type?: "button" | "submit" | "reset" 
  children?: React.ReactNode
  props?: any
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  disabled?: boolean
  isLoading?: boolean
  style?: React.CSSProperties
}

export const MainButton = ({
    isLoading,
    onClick,
    type = "button",
    children,
    className,
    disabled = false,
    ...props
  }: MainButtonProps) => (
    <button
      type={type}
      className={` p-3 h-[41px] text-[16px] text-white justify-center flex items-center rounded-3xl bg-primary font-light border hover:bg-white hover:text-primary ${className} `}
      {...props}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? <ClipLoader color="#fff" size="20px" /> : children}
    </button>
  )