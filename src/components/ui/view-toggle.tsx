import { motion } from "framer-motion";
import React from "react";

interface ViewToggleProps {
  options: { label: string; value: string }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ options, activeTab, setActiveTab }) => {
  const id = options[0].value;
  return (
    <div className="flex border-[1px] border-[#00000033] justify-between items-center px-1 rounded-full">
      {options.map((option) => (
        <motion.button
          initial={false}
          key={option.value}
          className={`my-1 py-2 min-w-[110px] relative cursor-pointer px-4 transition-colors duration-300 font-medium text-sm bg-transparent  ${
            option.value === activeTab ? "text-white" : "text-primary"
          }`}
          onClick={() => setActiveTab(option.value)}
        >
          <p className="z-[1] relative text-inherit">{option.label}</p>
          {option.value === activeTab ? (
            <motion.div
              className="absolute bottom-[0px] left-0 right-0 rounded-full h-full w-full bg-primary"
              layoutId={`underline-${id}`}
              id="underline"
            />
          ) : null}
        </motion.button>
      ))}
    </div>
  );
};

export default ViewToggle;
