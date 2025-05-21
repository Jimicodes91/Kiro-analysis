interface DonutChartProps {
  completed: number;
  inProgress: number;
  overdue: number;
}

export const DonutChart = ({ completed, inProgress, overdue }: DonutChartProps) => {
  const total = completed + inProgress + overdue;

  // Calculate segment percentages
  const completedPercent = (completed / total) * 100;
  const inProgressPercent = (inProgress / total) * 100;
  const overduePercent = (overdue / total) * 100;

  return (
    <div className="relative w-32 h-32">
      {/* SVG Donut Chart */}
      <svg viewBox="0 0 36 36" className="w-full h-full">
        {/* Define the arc paths for each segment */}
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeDasharray={`${completedPercent}, 100`}
          strokeLinecap="round"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="3"
          strokeDasharray={`${inProgressPercent}, 100`}
          strokeDashoffset={`${-completedPercent}`}
          strokeLinecap="round"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          strokeDasharray={`${overduePercent}, 100`}
          strokeDashoffset={`${-(completedPercent + inProgressPercent)}`}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold">{total}</span>
        <span className="text-xs text-gray-500">total task</span>
      </div>
    </div>
  );
};
