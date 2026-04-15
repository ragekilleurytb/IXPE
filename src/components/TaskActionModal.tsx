import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Trash2, X } from 'lucide-react';
import { Task } from '../types';

interface TaskActionModalProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskActionModal({ task, onClose, onEdit, onDelete }: TaskActionModalProps) {
  if (!task) return null;

  return (
    <AnimatePresence>
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
          className="relative w-full max-w-sm bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-white mb-6 text-center pr-6">{task.name}</h3>
          <div className="space-y-3">
            <button
              onClick={() => { onEdit(task); onClose(); }}
              className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-xl transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              <span className="font-medium">Edit</span>
            </button>
            <button
              onClick={() => { onDelete(task.id); onClose(); }}
              className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-4 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">Delete</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
