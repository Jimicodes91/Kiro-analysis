import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "../../index.css";

interface ModalProps {
  title?: ReactNode;
  closeModal: () => void;
  children: ReactNode;
  className?: string;
  expandRoute?: string;
  showExpandButton?: boolean;
  fullHeight?: boolean;
}

const dropIn = {
  hidden: {
    y: "-30vh",
  },
  visible: {
    y: "0",
    transition: {
      duration: 0.3,
      type: "spring",
      damping: 25,
    },
  },
  exit: {
    y: "-30vh",
    opacity: 0,
    transition: {
      duration: 0.2,
      type: "spring",
      damping: 25,
    },
  },
};

const Modal = ({
  title,
  children,
  closeModal,
  className,
  expandRoute,
  showExpandButton = false,
  fullHeight = true,
}: ModalProps) => {
  const navigate = useNavigate();

  const handleExpand = () => {
    if (expandRoute) {
      navigate(expandRoute);
    }
  };

  return (
    <motion.div
      className={`fixed top-0 right-0 w-full h-screen flex ${
        fullHeight ? "items-center" : "items-start"
      } justify-end z-50 backdrop-blur-sm ${className}`}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="fixed w-full top-0 right-0 h-screen bg-black"
        onClick={closeModal}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
      ></motion.div>
      <motion.div
        className={`bg-white rounded-lg p-4 z-50 w-[90%] md:w-[60%] lg:w-[38%] ${
          fullHeight ? "h-full max-h-[90%]" : " max-h-[90%] mt-6"
        } mx-[2%] flex flex-col`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="border rounded-lg flex flex-col h-full">
          {/* Fixed Header */}
          <div className="flex justify-between pb-4 p-3 rounded-tl-lg rounded-rl-lg border-b border-[1px] sticky top-0 z-10 border-t-0 border-l-0 border-r-0">
            <div className="flex items-center gap-4">
              {showExpandButton && (
                <button
                  onClick={handleExpand}
                  className="text-light hover:text-gray-700 focus:outline-none"
                  title="Expand"
                >
                  <BsArrowsAngleExpand />
                </button>
              )}
              <div className="text-[18px] font-medium text-[#191819]">{title}</div>
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

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto flex-grow custom-scrollbar">
            <div>{children}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
