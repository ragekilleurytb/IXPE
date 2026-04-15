import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { EpicQuest } from '../types';

interface EpicQuestsModalProps {
  isOpen: boolean;
  quests: EpicQuest[];
  onClose: () => void;
  onAdd: (name: string, xp: number) => void;
  onDelete: (id: string) => void;
}

export function EpicQuestsModal({ isOpen, quests, onClose, onAdd, onDelete }: EpicQuestsModalProps) {
  const [newName, setNewName] = useState('');
  const [newXp, setNewXp] = useState(50);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAdd(newName.trim(), newXp);
    setNewName('');
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
            className="relative w-full max-w-md bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800 max-h-[80vh] flex flex-col"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Epic Quests</h2>
            
            <div className="overflow-y-auto flex-1 mb-6 space-y-2 pr-2">
              {quests.map(q => (
                <div key={q.id} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{q.name}</p>
                    <p className="text-xs text-yellow-500">{q.xp} XP</p>
                  </div>
                  <button onClick={() => onDelete(q.id)} className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {quests.length === 0 && (
                <p className="text-center text-zinc-500 text-sm py-4">No epic quests.</p>
              )}
            </div>

            <form onSubmit={handleAdd} className="pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">New quest</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Quest name"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600"
                />
                <select
                  value={newXp}
                  onChange={(e) => setNewXp(Number(e.target.value))}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2 text-sm text-white focus:outline-none focus:border-zinc-600"
                >
                  <option value={25}>25 XP</option>
                  <option value={50}>50 XP</option>
                  <option value={100}>100 XP</option>
                  <option value={200}>200 XP</option>
                </select>
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="bg-zinc-100 text-zinc-950 p-2 rounded-xl disabled:opacity-50 transition-transform active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
