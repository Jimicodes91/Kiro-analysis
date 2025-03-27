import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  title?: ReactNode;
  closeModal: () => void;
  children: ReactNode;
  className?: string;
  expandRoute?: string;
  showExpandButton?: boolean;
}

const Modal = ({
  title,
  children,
  closeModal,
  className,
  expandRoute,
  showExpandButton = false,
}: ModalProps) => {
  const navigate = useNavigate();

  const handleExpand = () => {
    if (expandRoute) {
      navigate(expandRoute);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-full h-full flex items-center justify-end z-50 bg-[#00000033] ${className}`}
    >
      <div
        className="absolute w-full h-full bg-gray-900 opacity-50"
        onClick={closeModal}
      ></div>
      <div className="bg-white  border-[1px] rounded-lg p-4 z-50 w-[90%] md:w-[40%] h-full max-h-[90%] mx-[3%] overflow-y-auto">
        <div className=" border-[1px] rounded-lg">
          <div className="flex justify-between pb-4 p-3  border-b border-[1px] border-t-0">
            <div className="flex items-center gap-4">
              {showExpandButton && (
                <button
                  onClick={handleExpand}
                  className="text-light hover:text-gray-700 focus:outline-none"
                  title="Expand"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>
              )}
              <div className="text-lg font-medium text-[#19181980]">{title}</div>
            </div>
            <button
              onClick={closeModal}
              className="text-light hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className=" border-[1px] rounded-lg p-4 m-2 mt-4 ">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
