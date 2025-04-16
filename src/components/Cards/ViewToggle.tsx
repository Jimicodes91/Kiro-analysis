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
    <div className="border-[1px] border-gray-200 flex space-x-2 px-1 py-1 rounded-full">
      {options.map((option) => (
        <motion.button
          initial={false}
          key={option.value}
          className={`relative py-2 cursor-pointer px-4 transition-colors flex text-center justify-center items-center duration-300 font-medium text-sm w-[120px] bg-transparent ${
            option.value === activeTab ? "text-white" : "text-primary"
          }`}
          onClick={() => setActiveTab(option.value)}
        >
          <p className="z-[1] relative text-inherit">{option.label}</p>
          {option.value === activeTab ? (
            <motion.div
              className="absolute top-0 left-0 right-0 rounded-full h-full w-full bg-primary"
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
