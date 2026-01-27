
import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 1
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const percentage = isNaN(value) || !isFinite(value) ? 0 : Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
            ></div>
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-10 text-right">{percentage}%</span>
    </div>
  );
};

export default ProgressBar;
