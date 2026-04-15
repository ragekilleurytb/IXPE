import { motion } from 'motion/react';
import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: React.ReactNode;
  level?: number;
  colorClass: string;
  large?: boolean;
  leftAddon?: React.ReactNode;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, level, colorClass, large = false, leftAddon }) => {
  return (
    <div className="w-full flex items-start gap-3">
      {leftAddon && <div className={large ? "mt-2" : "mt-0.5"}>{leftAddon}</div>}
      <div className="flex-1">
        {(label || level !== undefined) && (
          <div className="flex justify-between items-end mb-1.5">
            <span className={`font-medium ${large ? 'text-sm text-zinc-200' : 'text-[10px] text-zinc-400 uppercase tracking-wider'}`}>{label}</span>
            {level !== undefined && <span className={`font-bold ${large ? 'text-lg text-white' : 'text-xs text-zinc-300'}`}>Lvl {level}</span>}
          </div>
        )}
        <div className={`${large ? 'h-3' : 'h-1.5'} bg-zinc-800/80 rounded-full overflow-hidden`}>
          <motion.div
            className={`h-full ${colorClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
