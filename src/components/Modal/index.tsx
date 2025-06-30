import { motion } from "framer-motion";
import { type ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
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
  isOpen?: boolean;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
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
    opacity: 0.3,
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
  isOpen = false,
  closeOnEsc = true,
  closeOnOverlayClick = true,
}: ModalProps) => {
  const navigate = useNavigate();
  const modalRoot = document.getElementById("modal-root");

  const handleExpand = () => {
    if (expandRoute) navigate(expandRoute);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEsc) {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [closeModal, isOpen, closeOnEsc]);

  if (!isOpen || !modalRoot) return null;

  return ReactDOM.createPortal(
    <motion.div
      className={`fixed top-0 right-0 w-full py-6 h-screen scroll-smooth items-start flex justify-end z-50 backdrop-blur-[2px] ${className}`}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="fixed w-full top-0 right-0 h-screen bg-black"
        onClick={() => {
          if (closeOnOverlayClick) closeModal();
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 1 }}
      />
      <motion.div
        className="bg-white rounded-lg p-4 z-50 w-full max-w-md max-h-full mx-[20px] flex flex-col scroll-smooth"
        // @ts-expect-error kddkjd
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="border rounded-lg flex flex-col h-fit custom-scrollbar scroll-smooth overflow-y-auto">
          <div className="flex justify-between pb-4 bg-white p-3 rounded-tl-lg rounded-rl-lg border-b sticky top-0 z-10">
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
              <div className="text-[18px] font-semibold text-[#191819]">{title}</div>
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

          <div className="h-full flex-grow scroll-smooth">
            <div>{children}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    modalRoot
  );
};

export default Modal;
