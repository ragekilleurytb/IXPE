import { Category, Task } from './types';

export function getGlobalLevelInfo(totalXp: number = 0) {
  const safeXp = Number(totalXp) || 0;
  let level = 1;
  let xpForNextLevel = 100;
  let currentLevelBaseXp = 0;

  while (true) {
    if (safeXp >= currentLevelBaseXp + xpForNextLevel) {
      currentLevelBaseXp += xpForNextLevel;
      level++;
      if (xpForNextLevel < 1000) {
        xpForNextLevel += 100;
      }
    } else {
      break;
    }
  }

  const xpInCurrentLevel = safeXp - currentLevelBaseXp;
  return { level, xpInCurrentLevel, xpForNextLevel };
}

export function getCategoryLevelInfo(totalXp: number = 0) {
  const safeXp = Number(totalXp) || 0;
  const level = Math.floor(safeXp / 100) + 1;
  const xpInCurrentLevel = safeXp % 100;
  return { level, xpInCurrentLevel, xpForNextLevel: 100 };
}

export function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export function isSameWeek(d1: Date, d2: Date) {
  const m1 = getMonday(d1);
  const m2 = getMonday(d2);
  return isSameDay(m1, m2);
}

export function isSameMonth(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth();
}

export function getCompletionsThisPeriod(task: Task, now: Date = new Date()): string[] {
  if (!task.completedDates) return [];
  return task.completedDates.filter(dateStr => {
    const d = new Date(dateStr);
    if (task.frequency === 'Daily') return isSameDay(d, now);
    if (task.frequency === 'Weekly') return isSameWeek(d, now);
    if (task.frequency === 'Monthly') return isSameMonth(d, now);
    return false;
  });
}

export function hasCompletedToday(task: Task, now: Date = new Date()): boolean {
  if (!task.completedDates) return false;
  return task.completedDates.some(dateStr => isSameDay(new Date(dateStr), now));
}

export function isTaskCompleted(task: Task, now: Date = new Date()) {
  const completions = getCompletionsThisPeriod(task, now);
  const target = task.targetCount || 1;
  return completions.length >= target;
}

export function calculateStreak(tasks: Task[], now: Date = new Date()): number {
  const completedDays = new Set<string>();
  
  tasks.forEach(task => {
    if (task.completedDates) {
      task.completedDates.forEach(dateStr => {
        const d = new Date(dateStr);
        completedDays.add(d.toDateString());
      });
    }
  });

  let streak = 0;
  let current = new Date(now);
  
  if (completedDays.has(current.toDateString())) {
    streak++;
    current.setDate(current.getDate() - 1);
  } else {
    current.setDate(current.getDate() - 1);
    if (!completedDays.has(current.toDateString())) {
      return 0;
    }
    streak++;
    current.setDate(current.getDate() - 1);
  }

  while (completedDays.has(current.toDateString())) {
    streak++;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  'Vitality': 'bg-green-500',
  'Charisma': 'bg-pink-500',
  'Strength': 'bg-red-500',
  'Wisdom': 'bg-blue-500',
  'Social': 'bg-yellow-500',
  'Camp': 'bg-orange-500',
};
