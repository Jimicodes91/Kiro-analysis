import { motion } from "framer-motion";
import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 h-[10px] rounded-full mb-8">
      <motion.div
        className="bg-primary h-3 rounded-full"
        style={{ width: `${progress}%` }}
        layout
      ></motion.div>
    </div>
  );
};

export default ProgressBar;
