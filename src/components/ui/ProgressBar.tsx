"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  glow?: boolean;
  className?: string;
}

function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  glow = true,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-slate-grey">Progress</span>
          <span className="text-sm font-medium text-pistachio">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-navy-light rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-pistachio rounded-full ${glow ? "animate-pulse-glow" : ""}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export { ProgressBar, type ProgressBarProps };
