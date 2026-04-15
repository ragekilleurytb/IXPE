import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { Task } from '../types';
import { getCompletionsThisPeriod, hasCompletedToday } from '../utils';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onLongPress: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onLongPress }: TaskItemProps) {
  const [showXpAnim, setShowXpAnim] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const now = new Date();
  const completions = getCompletionsThisPeriod(task, now);
  const completedToday = hasCompletedToday(task, now);
  const target = task.targetCount || 1;
  const isCompleted = completions.length >= target;

  const handlePointerDown = () => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress(task);
    }, 500);
  };

  const handlePointerUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClick = () => {
    if (isLongPressRef.current) return;
    
    if (!completedToday && completions.length < target) {
      setShowXpAnim(true);
      setTimeout(() => setShowXpAnim(false), 1000);
    }
    onToggle(task);
  };

  const xpPerTick = Math.ceil(task.xp / target);

  return (
    <div 
      className="relative flex items-center justify-between p-4 mb-3 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 active:scale-[0.98] transition-transform select-none touch-manipulation"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
    >
      <AnimatePresence>
        {showXpAnim && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -40, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className="absolute left-14 top-0 text-yellow-400 font-bold text-sm pointer-events-none z-10 drop-shadow-md"
          >
            +{xpPerTick} XP
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 flex-1 cursor-pointer">
        {target > 1 ? (
          <div className="flex flex-col gap-1 w-8 h-8 justify-center">
            <div className="flex gap-0.5 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              {Array.from({ length: target }).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-full transition-colors duration-300 ${i < completions.length ? 'bg-zinc-400' : 'bg-transparent'}`}
                />
              ))}
            </div>
            <span className="text-[9px] text-center text-zinc-500 font-mono">{completions.length}/{target}</span>
          </div>
        ) : (
          <div
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isCompleted ? 'bg-zinc-700 border-zinc-700' : 'border-zinc-600'
            }`}
          >
            <motion.div
              initial={false}
              animate={{ scale: isCompleted ? 1 : 0, opacity: isCompleted ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="w-4 h-4 text-zinc-950" strokeWidth={3} />
            </motion.div>
          </div>
        )}
        
        <div className={`flex-1 transition-all duration-300 ${isCompleted ? 'opacity-40 line-through' : ''}`}>
          <p className="text-base font-medium text-zinc-100">{task.name}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{task.category} • {task.xp} XP {target > 1 && `(${xpPerTick}/time)`}</p>
        </div>
      </div>
    </div>
  );
}
