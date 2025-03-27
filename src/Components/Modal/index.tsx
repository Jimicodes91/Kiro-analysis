import { type ReactNode } from "react"

interface ModalProps {
  title?: ReactNode
  closeModal: () => void
  children: ReactNode
  className?: string
}

const Modal = ({ title, children, closeModal, className }: ModalProps) => {
  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-[#00000033] ${className}`}>
      <div
        className="absolute w-full h-full bg-gray-900 opacity-50"
        onClick={closeModal}
      ></div>
      <div className="bg-white rounded-lg p-4 z-50 w-[80%] md:w-[45%] xl:w-[35%] items-center">
        <div className="flex justify-between pb-4">
          <div className="text-2xl font-extrabold">{title}</div>
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

        <div className="">{children}</div>
      </div>
    </div>
  )
}

export default Modal
