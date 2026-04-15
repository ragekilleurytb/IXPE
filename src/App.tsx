import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles, Flame } from 'lucide-react';
import { Task, Category, Frequency, AppState } from './types';
import { INITIAL_TASKS, RANDOM_QUESTS } from './data';
import { getGlobalLevelInfo, getCategoryLevelInfo, isTaskCompleted, CATEGORY_COLORS, getCompletionsThisPeriod, hasCompletedToday, isSameDay, calculateStreak } from './utils';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ProgressBar } from './components/ProgressBar';
import { TaskItem } from './components/TaskItem';
import { AddModal } from './components/AddModal';
import { TaskActionModal } from './components/TaskActionModal';
import { EpicQuestsModal } from './components/EpicQuestsModal';

const CATEGORIES: Category[] = ['Vitality', 'Charisma', 'Strength', 'Wisdom', 'Social', 'Camp'];

export default function App() {
  const [state, setState] = useLocalStorage<AppState>('life-rpg-state', {
    globalXp: 0,
    categoryXp: {
      'Vitality': 0,
      'Charisma': 0,
      'Strength': 0,
      'Wisdom': 0,
      'Social': 0,
      'Camp': 0,
    },
    tasks: INITIAL_TASKS,
    epicQuests: RANDOM_QUESTS,
  });

  const [activeTab, setActiveTab] = useState<Frequency>('Daily');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevGlobalLevel, setPrevGlobalLevel] = useState(1);
  
  const [actionTask, setActionTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);

  const epicTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isEpicLongPressRef = useRef(false);

  // Migration for older states
  useEffect(() => {
    let needsUpdate = false;
    const newState = { ...state };

    if (!newState.epicQuests) {
      newState.epicQuests = RANDOM_QUESTS;
      needsUpdate = true;
    }

    // Migrate French categories to English
    const categoryMap: Record<string, Category> = {
      'Vitalité': 'Vitality',
      'Charisme': 'Charisma',
      'Force': 'Strength',
      'Sagesse': 'Wisdom',
      'Campement': 'Camp'
    };

    for (const [fr, en] of Object.entries(categoryMap)) {
      if (newState.categoryXp[fr as any] !== undefined) {
        newState.categoryXp[en] = (newState.categoryXp[en] || 0) + newState.categoryXp[fr as any];
        delete newState.categoryXp[fr as any];
        needsUpdate = true;
      }
    }

    // Ensure all English categories exist in categoryXp
    CATEGORIES.forEach(cat => {
      if (newState.categoryXp[cat] === undefined) {
        newState.categoryXp[cat] = 0;
        needsUpdate = true;
      }
    });

    // Migrate tasks categories, frequencies, and names
    const freqMap: Record<string, Frequency> = {
      'Quotidien': 'Daily',
      'Hebdo': 'Weekly',
      'Mensuel': 'Monthly'
    };

    let tasksMigrated = false;
    const updatedTasks = newState.tasks.map(t => {
      let updated = false;
      const newT = { ...t };
      
      if (categoryMap[t.category as any]) {
        newT.category = categoryMap[t.category as any];
        updated = true;
      }
      if (freqMap[t.frequency as any]) {
        newT.frequency = freqMap[t.frequency as any];
        updated = true;
      }
      
      // Translate default task names
      const defaultTask = INITIAL_TASKS.find(it => it.id === t.id);
      if (defaultTask && newT.name !== defaultTask.name) {
        newT.name = defaultTask.name;
        updated = true;
      }

      if (updated) tasksMigrated = true;
      return newT;
    });

    if (tasksMigrated) {
      newState.tasks = updatedTasks;
      needsUpdate = true;
    }

    // Re-add missing initial tasks
    INITIAL_TASKS.forEach(initialTask => {
      if (!newState.tasks.some(t => t.id === initialTask.id)) {
        newState.tasks.push(initialTask);
        needsUpdate = true;
      }
    });

    // Translate epic quests
    let epicQuestsMigrated = false;
    const updatedEpicQuests = newState.epicQuests.map(eq => {
      const defaultEq = RANDOM_QUESTS.find(rq => rq.id === eq.id);
      if (defaultEq && eq.name !== defaultEq.name) {
        epicQuestsMigrated = true;
        return { ...eq, name: defaultEq.name };
      }
      return eq;
    });

    if (epicQuestsMigrated) {
      newState.epicQuests = updatedEpicQuests;
      needsUpdate = true;
    }

    if (needsUpdate) {
      setState(newState);
    }
  }, []);

  const globalInfo = getGlobalLevelInfo(state.globalXp);
  const currentStreak = calculateStreak(state.tasks);

  useEffect(() => {
    if (globalInfo.level > prevGlobalLevel && prevGlobalLevel !== 1) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    setPrevGlobalLevel(globalInfo.level);
  }, [globalInfo.level, prevGlobalLevel]);

  const handleToggleTask = (task: Task) => {
    const now = new Date();
    const completions = getCompletionsThisPeriod(task, now);
    const completedToday = hasCompletedToday(task, now);
    const target = task.targetCount || 1;

    let newCompletedDates = [...(task.completedDates || [])];
    let xpChange = 0;
    const xpPerTick = Math.ceil(task.xp / target);

    if (completedToday) {
      newCompletedDates = newCompletedDates.filter(d => !isSameDay(new Date(d), now));
      xpChange = -xpPerTick;
    } else {
      if (completions.length < target) {
        newCompletedDates.push(now.toISOString());
        xpChange = xpPerTick;
      } else {
        return;
      }
    }

    setState(prev => {
      const newTasks = prev.tasks.map(t => t.id === task.id ? { ...t, completedDates: newCompletedDates } : t);
      return {
        ...prev,
        globalXp: Math.max(0, prev.globalXp + xpChange),
        categoryXp: {
          ...prev.categoryXp,
          [task.category]: Math.max(0, prev.categoryXp[task.category] + xpChange),
        },
        tasks: newTasks,
      };
    });
  };

  const handleDeleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));
  };

  const handleAddOrEditTask = (name: string, category: Category, frequency: Frequency, xp: number, targetCount: number) => {
    setState(prev => {
      if (editingTask) {
        const now = new Date();
        const completionsToday = (editingTask.completedDates || []).filter(d => isSameDay(new Date(d), now)).length;
        
        let newGlobalXp = prev.globalXp;
        let newCategoryXp = { ...prev.categoryXp };
        let newCompletedDates = [...(editingTask.completedDates || [])];

        if (completionsToday > 0) {
          const oldTarget = editingTask.targetCount || 1;
          const oldXpPerTick = Math.ceil(editingTask.xp / oldTarget);
          const totalXpToDeduct = oldXpPerTick * completionsToday;
          
          newCompletedDates = newCompletedDates.filter(d => !isSameDay(new Date(d), now));
          newGlobalXp = Math.max(0, newGlobalXp - totalXpToDeduct);
          newCategoryXp[editingTask.category] = Math.max(0, newCategoryXp[editingTask.category] - totalXpToDeduct);
        }

        return {
          ...prev,
          globalXp: newGlobalXp,
          categoryXp: newCategoryXp,
          tasks: prev.tasks.map(t => t.id === editingTask.id ? { ...t, name, category, frequency, xp, targetCount, completedDates: newCompletedDates } : t),
        };
      } else {
        const newTask: Task = {
          id: Math.random().toString(36).substring(7),
          name,
          category,
          frequency,
          xp,
          targetCount,
          completedDates: [],
        };
        return { ...prev, tasks: [...prev.tasks, newTask] };
      }
    });
    setEditingTask(null);
  };

  const handleGenerateEpicQuest = () => {
    if (isEpicLongPressRef.current) return;
    const quests = state.epicQuests?.length ? state.epicQuests : RANDOM_QUESTS;
    const randomQuest = quests[Math.floor(Math.random() * quests.length)];
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    handleAddOrEditTask(randomQuest.name, randomCategory, 'Daily', randomQuest.xp, 1);
  };

  const handleEpicPointerDown = () => {
    isEpicLongPressRef.current = false;
    epicTimerRef.current = setTimeout(() => {
      isEpicLongPressRef.current = true;
      setIsEpicModalOpen(true);
    }, 500);
  };

  const handleEpicPointerUp = () => {
    if (epicTimerRef.current) clearTimeout(epicTimerRef.current);
  };

  const handleAddEpicQuest = (name: string, xp: number) => {
    setState(prev => ({
      ...prev,
      epicQuests: [...(prev.epicQuests || []), { id: Math.random().toString(36).substring(7), name, xp }]
    }));
  };

  const handleDeleteEpicQuest = (id: string) => {
    setState(prev => ({
      ...prev,
      epicQuests: (prev.epicQuests || []).filter(q => q.id !== id)
    }));
  };

  const handleExport = () => {
    try {
      const data = btoa(encodeURIComponent(JSON.stringify(state)));
      navigator.clipboard.writeText(data);
      alert('Save code copied to clipboard!');
    } catch (e) {
      alert("Error during export.");
    }
  };

  const handleImport = () => {
    const data = prompt('Paste your save code here:');
    if (!data) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(atob(data)));
      if (parsed && typeof parsed === 'object' && 'globalXp' in parsed) {
        setState(parsed);
        window.location.reload();
      } else {
        alert('Invalid save code.');
      }
    } catch (e) {
      alert('Invalid or corrupted save code.');
    }
  };

  const filteredTasks = useMemo(() => {
    return state.tasks.filter(t => t.frequency === activeTab);
  }, [state.tasks, activeTab]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-40">
      {/* Header Section */}
      <header className="px-6 pt-12 pb-6 bg-zinc-950 sticky top-0 z-20 border-b border-zinc-900/50 backdrop-blur-xl">
        <div className="mb-8">
          <ProgressBar
            progress={(globalInfo.xpInCurrentLevel / globalInfo.xpForNextLevel) * 100}
            label="Global Level"
            leftAddon={
              <div className="flex flex-col items-center justify-center text-orange-500 bg-orange-500/10 px-2 py-1.5 rounded-xl min-w-[3.5rem]">
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  <span className="font-bold text-sm">{currentStreak}</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 mt-0.5">{currentStreak > 1 ? 'days' : 'day'}</span>
              </div>
            }
            level={globalInfo.level}
            colorClass="bg-zinc-100"
            large
          />
          <p className="text-right text-xs text-zinc-500 mt-2 font-mono">
            {globalInfo.xpInCurrentLevel} / {globalInfo.xpForNextLevel} XP
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {CATEGORIES.map(cat => {
            const info = getCategoryLevelInfo(state.categoryXp[cat]);
            return (
              <ProgressBar
                key={cat}
                progress={(info.xpInCurrentLevel / info.xpForNextLevel) * 100}
                label={cat}
                level={info.level}
                colorClass={CATEGORY_COLORS[cat]}
              />
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pt-6">
        {/* Tabs */}
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl mb-6">
          {(['Daily', 'Weekly', 'Monthly'] as Frequency[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab === 'Daily' ? "Today" : tab === 'Weekly' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-zinc-600 py-10"
              >
                No quests for now.
              </motion.p>
            ) : (
              filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskItem
                    task={task}
                    onToggle={handleToggleTask}
                    onLongPress={(t) => setActionTask(t)}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent z-20">
        <div className="flex gap-3 max-w-md mx-auto mb-4">
          <button
            onPointerDown={handleEpicPointerDown}
            onPointerUp={handleEpicPointerUp}
            onPointerLeave={handleEpicPointerUp}
            onClick={handleGenerateEpicQuest}
            className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform select-none touch-manipulation"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">Epic Quest</span>
          </button>
          <button
            onClick={() => { setEditingTask(null); setIsAddModalOpen(true); }}
            className="flex-1 bg-zinc-100 text-zinc-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">Add</span>
          </button>
        </div>
        
        {/* Import/Export */}
        <div className="flex justify-center gap-6 text-xs text-zinc-600">
          <button onClick={handleExport} className="hover:text-zinc-400 transition-colors">Export</button>
          <button onClick={handleImport} className="hover:text-zinc-400 transition-colors">Import</button>
        </div>
      </div>

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingTask(null); }}
        onAdd={handleAddOrEditTask}
        initialTask={editingTask}
      />

      <TaskActionModal
        task={actionTask}
        onClose={() => setActionTask(null)}
        onEdit={(t) => { setEditingTask(t); setIsAddModalOpen(true); }}
        onDelete={handleDeleteTask}
      />

      <EpicQuestsModal
        isOpen={isEpicModalOpen}
        quests={state.epicQuests || []}
        onClose={() => setIsEpicModalOpen(false)}
        onAdd={handleAddEpicQuest}
        onDelete={handleDeleteEpicQuest}
      />

      {/* Level Up Celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md"
            onClick={() => setShowLevelUp(false)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-yellow-400" />
              </div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Level Up!</h2>
              <p className="text-xl text-zinc-400">You reached level {globalInfo.level}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
