export type Category = 'Vitality' | 'Charisma' | 'Strength' | 'Wisdom' | 'Social' | 'Camp';
export type Frequency = 'Daily' | 'Weekly' | 'Monthly';

export interface Task {
  id: string;
  name: string;
  category: Category;
  frequency: Frequency;
  xp: number;
  completedDates: string[]; // ISO strings
  targetCount?: number; // For multi-completion tasks
}

export interface EpicQuest {
  id: string;
  name: string;
  xp: number;
}

export interface AppState {
  globalXp: number;
  categoryXp: Record<Category, number>;
  tasks: Task[];
  epicQuests: EpicQuest[];
}
