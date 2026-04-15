import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Category, Frequency, Task } from '../types';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, category: Category, frequency: Frequency, xp: number, targetCount: number) => void;
  initialTask?: Task | null;
}

const CATEGORIES: Category[] = ['Vitality', 'Charisma', 'Strength', 'Wisdom', 'Social', 'Camp'];
const FREQUENCIES: Frequency[] = ['Daily', 'Weekly', 'Monthly'];
const DIFFICULTIES = [
  { label: 'Easy', xp: 10 },
  { label: 'Medium', xp: 25 },
  { label: 'Hard', xp: 50 },
  { label: 'Extreme', xp: 100 },
];

export function AddModal({ isOpen, onClose, onAdd, initialTask }: AddModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Vitality');
  const [frequency, setFrequency] = useState<Frequency>('Daily');
  const [xp, setXp] = useState(10);
  const [targetCount, setTargetCount] = useState<string>('1');

  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setName(initialTask.name);
        setCategory(initialTask.category);
        setFrequency(initialTask.frequency);
        setXp(initialTask.xp);
        setTargetCount((initialTask.targetCount || 1).toString());
      } else {
        setName('');
        setCategory('Vitality');
        setFrequency('Daily');
        setXp(10);
        setTargetCount('1');
      }
    }
  }, [isOpen, initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Parse targetCount, default to 1 if empty or invalid
    let parsedTargetCount = parseInt(targetCount, 10);
    if (isNaN(parsedTargetCount) || parsedTargetCount < 1) {
      parsedTargetCount = 1;
    }

    if (frequency === 'Weekly' && parsedTargetCount > 7) {
      parsedTargetCount = 7;
    } else if (frequency === 'Monthly' && parsedTargetCount > 31) {
      parsedTargetCount = 31;
    }

    onAdd(name.trim(), category, frequency, xp, parsedTargetCount);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="relative w-full max-w-md bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">{initialTask ? 'Edit Quest' : 'Add Quest'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Quest Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                  placeholder="Ex: Read 10 pages"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-600 appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => {
                      setFrequency(e.target.value as Frequency);
                      if (e.target.value === 'Daily') setTargetCount('1');
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-600 appearance-none"
                  >
                    {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {frequency !== 'Daily' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Recurrence (times per period)</label>
                  <input
                    type="number"
                    min="1"
                    max={frequency === 'Weekly' ? "7" : "31"}
                    value={targetCount}
                    onChange={(e) => setTargetCount(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                    placeholder="1"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Total XP will be divided by this number.</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Total XP</label>
                <div className="grid grid-cols-4 gap-2">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d.xp}
                      type="button"
                      onClick={() => setXp(d.xp)}
                      className={`py-2 rounded-xl text-xs font-medium transition-colors ${
                        xp === d.xp ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {d.label}
                      <span className="block opacity-60 text-[10px]">{d.xp} XP</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-zinc-100 text-zinc-950 font-bold py-4 rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
              >
                {initialTask ? 'Save' : 'Create'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
