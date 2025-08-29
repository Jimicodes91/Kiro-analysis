import React from "react";
import { SectionHeader } from "./components/section-header";

interface TaskReportProps {
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  pendingTasks: number;
  onViewMore?: () => void;
}

const TaskReport: React.FC<TaskReportProps> = ({
  completedTasks,
  inProgressTasks,
  overdueTasks,
  pendingTasks,
  onViewMore,
}) => {
  const totalTasks = completedTasks + inProgressTasks + overdueTasks + pendingTasks;
  // Calculate percentages for the donut chart
  const completedPercentage = (completedTasks / totalTasks) * 100;
  const inProgressPercentage = (inProgressTasks / totalTasks) * 100;
  const overduePercentage = (overdueTasks / totalTasks) * 100;
  const pendingPercentage = (pendingTasks / totalTasks) * 100;

  // Calculating stroke-dasharray and stroke-dashoffset for the SVG circle
  const circleRadius = 60;
  const circumference = 2 * Math.PI * circleRadius;

  // Start position for each segment (clockwise from top)
  //   const completedOffset = 0;
  //   const inProgressOffset = (completedPercentage / 100) * circumference;
  //   const overdueOffset =
  //     ((completedPercentage + inProgressPercentage) / 100) * circumference;

  return (
    <div className="bg-white rounded-[6px] border border-[#0000001A] px-4 pb-4 pt-2 flex flex-col h-full">
      <SectionHeader title="Task report" onViewMore={onViewMore} />

      <div className="flex flex-col items-center justify-center mt-4 relative">
        {/* Donut Chart */}
        <svg width="160" height="160" viewBox="0 0 160 160" className="relative">
          <circle
            cx="80"
            cy="80"
            r={circleRadius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="20"
          />

          {/* Completed segment (green) */}
          <circle
            cx="80"
            cy="80"
            r={circleRadius}
            fill="none"
            stroke="#22c55e"
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (completedPercentage / 100) * circumference}
            transform="rotate(-90 80 80)"
            strokeLinecap="round"
          />

          {/* In Progress segment (yellow) */}
          <circle
            cx="80"
            cy="80"
            r={circleRadius}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (inProgressPercentage / 100) * circumference
            }
            transform={`rotate(${(completedPercentage / 100) * 360 - 90} 80 80)`}
            strokeLinecap="round"
          />

          {/* Overdue segment (red) */}
          <circle
            cx="80"
            cy="80"
            r={circleRadius}
            fill="none"
            stroke="#ef4444"
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (overduePercentage / 100) * circumference}
            transform={`rotate(${((completedPercentage + inProgressPercentage) / 100) * 360 - 90} 80 80)`}
            strokeLinecap="round"
          />

          <circle
            cx="80"
            cy="80"
            r={circleRadius}
            fill="none"
            stroke="#ffcc00"
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (pendingPercentage / 100) * circumference}
            transform={`rotate(${((completedPercentage + inProgressPercentage + overduePercentage) / 100) * 360 - 90} 80 80)`}
            strokeLinecap="round"
          />

          {/* Center text */}
          <text
            x="80"
            y="75"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-3xl font-bold fill-black"
          >
            {totalTasks}
          </text>
          <text
            x="80"
            y="95"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-500"
          >
            total task
          </text>
        </svg>

        {/* Task count indicators */}
        <div className="flex gap-1 flex-wrap justify-between w-full mt-6">
          <div className="text-center">
            <div className="text-lg font-medium">{completedTasks}</div>
            <div className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Completed
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-medium">{pendingTasks}</div>
            <div className="px-3 py-1 bg-[#F1E6D4] text-[#B78026] text-xs rounded-full">
              Pending
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-medium">{inProgressTasks}</div>
            <div className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
              In progress
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-medium">{overdueTasks}</div>
            <div className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Overdue
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReport;
